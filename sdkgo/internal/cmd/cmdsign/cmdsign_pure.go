// Package cmdsign provides pure Go reference implementations and CLI tools
// for Infinity6 request signing (Proof of Possession / Sender-Constrained Tokens).
//
// DESIGN NOTE: This file uses ONLY the Go standard library (no cryptz, no third-party
// packages). It serves as runnable developer documentation illustrating how any client
// application can sign HTTP requests and refresh assertions from scratch.
package cmdsign

import (
	"crypto/ed25519"
	"crypto/rand"
	"crypto/sha256"
	"encoding/base64"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"io"
	"net/url"
	"os"
	"sort"
	"strconv"
	"strings"
)

const (
	// TokenTypeSigEnvelope is Type 2: Composite request signature envelope (89 bytes).
	TokenTypeSigEnvelope uint8 = 2

	// TokenTypeRefreshAssertion is Type 3: Standalone refresh assertion token (121 bytes).
	TokenTypeRefreshAssertion uint8 = 3

	// FlagUnsignedBody is Bit 7 of Byte 0; if set (1), request body hashing is skipped.
	FlagUnsignedBody uint8 = 1 << 7 // 0x80

	// SigEnvelopeBinaryLen is the fixed binary size of a request signature envelope.
	SigEnvelopeBinaryLen = 89 // 1B type/flags + 8B exp + 16B nonce + 64B signature

	// RefreshAssertionBinaryLen is the fixed binary size of a refresh assertion.
	RefreshAssertionBinaryLen = 121 // 1B type/flags + 8B exp + 16B nonce + 32B pub_key + 64B signature
)

// RequestSignature holds the computed components of a signed HTTP request.
type RequestSignature struct {
	// CanonicalString is the exact 7-line UTF-8 string that was signed by Ed25519.
	CanonicalString string

	// EnvelopeBase64 is the unpadded Base64URL string of the 89-byte binary envelope (119 chars).
	EnvelopeBase64 string

	// HeaderValue is the single-header value for X-I6-Signature (<envelope>.<access_token>).
	HeaderValue string

	// Exp is the Unix epoch expiration in seconds.
	Exp uint64

	// Nonce is the 16-byte nonce used for anti-replay.
	Nonce [16]byte
}

// RefreshAssertion holds the computed components of a standalone refresh assertion.
type RefreshAssertion struct {
	// CanonicalString is the exact 7-line UTF-8 string that was signed by Ed25519.
	CanonicalString string

	// AssertionBase64 is the unpadded Base64URL string of the 121-byte assertion (162 chars).
	AssertionBase64 string

	// PublicKeyBase64 is the client's public key (JTI) encoded as unpadded Base64URL.
	PublicKeyBase64 string

	// Exp is the Unix epoch expiration in seconds.
	Exp uint64

	// Nonce is the 16-byte nonce used for anti-replay.
	Nonce [16]byte
}

// BuildCanonicalString constructs the canonical HTTP request byte stream for Ed25519 signing.
//
// Format (7 lines joined by '\n'):
//
//	Line 1: METHOD (e.g. "GET", "POST")
//	Line 2: PATH (normalized, leading slash, no trailing slash, e.g. "/api/datasetmanager/data")
//	Line 3: CANONICAL_QUERY (lexicographically sorted key=value pairs, without i6_sig)
//	Line 4: BODY_SHA256 (64-char lowercase hex SHA-256 of body, or "" if unsignedBody is true)
//	Line 5: TOKEN_SHA256 (64-char lowercase hex SHA-256 of accessToken, or "" for refresh assertions)
//	Line 6: EXP (decimal Unix epoch seconds, e.g. "1792933262")
//	Line 7: NONCE_HEX (32-char lowercase hex of 16-byte nonce, e.g. "0000...0000")
func BuildCanonicalString(method, rawPath, rawQuery string, body []byte, accessToken string, exp uint64, nonce [16]byte, unsignedBody bool) (string, error) {
	// Validate against newline injection
	if strings.ContainsAny(method, "\r\n") || strings.ContainsAny(rawPath, "\r\n") || strings.ContainsAny(rawQuery, "\r\n") {
		return "", fmt.Errorf("canonicalization error: method, path, or query contains illegal newline characters")
	}

	// 1. Method
	normMethod := strings.ToUpper(strings.TrimSpace(method))
	if normMethod == "" {
		return "", fmt.Errorf("canonicalization error: method cannot be empty")
	}

	// 2. Path normalization
	normPath := strings.TrimSpace(rawPath)
	if normPath == "" {
		normPath = "/"
	} else {
		if !strings.HasPrefix(normPath, "/") {
			normPath = "/" + normPath
		}
		if len(normPath) > 1 && strings.HasSuffix(normPath, "/") {
			normPath = strings.TrimSuffix(normPath, "/")
		}
	}

	// 3. Canonical Query String
	canonicalQuery := ""
	cleanQuery := strings.TrimPrefix(strings.TrimSpace(rawQuery), "?")
	if cleanQuery != "" {
		values, err := url.ParseQuery(cleanQuery)
		if err != nil {
			return "", fmt.Errorf("canonicalization error: invalid query string: %w", err)
		}
		// Strip signature param if present in query
		values.Del("i6_sig")

		keys := make([]string, 0, len(values))
		for k := range values {
			keys = append(keys, k)
		}
		sort.Strings(keys)

		var pairs []string
		for _, k := range keys {
			vs := values[k]
			sort.Strings(vs)
			escapedKey := url.QueryEscape(k)
			for _, v := range vs {
				pairs = append(pairs, escapedKey+"="+url.QueryEscape(v))
			}
		}
		canonicalQuery = strings.Join(pairs, "&")
	}

	// 4. Body SHA-256 Digest
	bodyHashHex := ""
	if !unsignedBody {
		h := sha256.Sum256(body)
		bodyHashHex = hex.EncodeToString(h[:])
	}

	// 5. Access Token SHA-256 Digest (Token Binding)
	tokenHashHex := ""
	if accessToken != "" {
		h := sha256.Sum256([]byte(accessToken))
		tokenHashHex = hex.EncodeToString(h[:])
	}

	// 6. Expiration seconds
	expStr := strconv.FormatUint(exp, 10)

	// 7. Nonce in hex (32 lowercase hex characters)
	nonceHex := hex.EncodeToString(nonce[:])

	return fmt.Sprintf("%s\n%s\n%s\n%s\n%s\n%s\n%s",
		normMethod,
		normPath,
		canonicalQuery,
		bodyHashHex,
		tokenHashHex,
		expStr,
		nonceHex,
	), nil
}

// SignRequest signs an HTTP request to downstream microservices and returns a RequestSignature.
//
// Wire format of X-I6-Signature:
//
//	<SigEnvelope_89B_Base64URL>.<BinaryAccessToken>
func SignRequest(privKey ed25519.PrivateKey, method, rawPath, rawQuery string, body []byte, accessToken string, exp uint64, nonce [16]byte, unsignedBody bool) (*RequestSignature, error) {
	if len(privKey) != ed25519.PrivateKeySize {
		return nil, fmt.Errorf("invalid ed25519 private key size: expected %d, got %d", ed25519.PrivateKeySize, len(privKey))
	}

	canonicalStr, err := BuildCanonicalString(method, rawPath, rawQuery, body, accessToken, exp, nonce, unsignedBody)
	if err != nil {
		return nil, err
	}

	// Compute Ed25519 signature over canonical string
	sig := ed25519.Sign(privKey, []byte(canonicalStr))

	// Assemble 89-byte binary envelope
	var buf [SigEnvelopeBinaryLen]byte
	firstByte := TokenTypeSigEnvelope
	if unsignedBody {
		firstByte |= FlagUnsignedBody
	}
	buf[0] = firstByte
	binary.BigEndian.PutUint64(buf[1:9], exp)
	copy(buf[9:25], nonce[:])
	copy(buf[25:89], sig)

	envelopeB64 := base64.RawURLEncoding.EncodeToString(buf[:])
	headerVal := envelopeB64
	if accessToken != "" {
		headerVal = envelopeB64 + "." + accessToken
	}

	return &RequestSignature{
		CanonicalString: canonicalStr,
		EnvelopeBase64:  envelopeB64,
		HeaderValue:     headerVal,
		Exp:             exp,
		Nonce:           nonce,
	}, nil
}

// SignRefreshAssertion signs a standalone refresh assertion for POST /api/userz/refresh-dataset.
//
// Wire format: 121-byte binary buffer encoded as unpadded Base64URL (162 chars).
func SignRefreshAssertion(privKey ed25519.PrivateKey, method, rawPath, rawQuery string, body []byte, exp uint64, nonce [16]byte, unsignedBody bool) (*RefreshAssertion, error) {
	if len(privKey) != ed25519.PrivateKeySize {
		return nil, fmt.Errorf("invalid ed25519 private key size: expected %d, got %d", ed25519.PrivateKeySize, len(privKey))
	}

	// Refresh assertion has no access token yet (empty token hash on line 5)
	canonicalStr, err := BuildCanonicalString(method, rawPath, rawQuery, body, "", exp, nonce, unsignedBody)
	if err != nil {
		return nil, err
	}

	sig := ed25519.Sign(privKey, []byte(canonicalStr))

	// Extract raw 32-byte public key
	pubKey, ok := privKey.Public().(ed25519.PublicKey)
	if !ok || len(pubKey) != ed25519.PublicKeySize {
		return nil, fmt.Errorf("failed to derive 32-byte ed25519 public key")
	}

	// Assemble 121-byte binary assertion
	var buf [RefreshAssertionBinaryLen]byte
	firstByte := TokenTypeRefreshAssertion
	if unsignedBody {
		firstByte |= FlagUnsignedBody
	}
	buf[0] = firstByte
	binary.BigEndian.PutUint64(buf[1:9], exp)
	copy(buf[9:25], nonce[:])
	copy(buf[25:57], pubKey)
	copy(buf[57:121], sig)

	assertionB64 := base64.RawURLEncoding.EncodeToString(buf[:])
	pubKeyB64 := base64.RawURLEncoding.EncodeToString(pubKey)

	return &RefreshAssertion{
		CanonicalString: canonicalStr,
		AssertionBase64: assertionB64,
		PublicKeyBase64: pubKeyB64,
		Exp:             exp,
		Nonce:           nonce,
	}, nil
}

// ParsePrivateKey decodes an Ed25519 private key from Base64URL, Hex, or raw string,
// supporting either 32-byte seeds or 64-byte private keys.
// If the key starts with '@', it reads the key from the specified file path.
func ParsePrivateKey(rawInput string) (ed25519.PrivateKey, error) {
	rawInput = strings.TrimSpace(rawInput)
	if strings.HasPrefix(rawInput, "@") {
		content, err := os.ReadFile(rawInput[1:])
		if err != nil {
			return nil, fmt.Errorf("failed to read private key file: %w", err)
		}
		rawInput = strings.TrimSpace(string(content))
	}

	// 1. Try Base64URL decoding (unpadded, then padded)
	if b, err := base64.RawURLEncoding.DecodeString(rawInput); err == nil {
		if k := keyFromBytes(b); k != nil {
			return k, nil
		}
	}
	if b, err := base64.URLEncoding.DecodeString(rawInput); err == nil {
		if k := keyFromBytes(b); k != nil {
			return k, nil
		}
	}

	// 2. Try Standard Base64 decoding
	if b, err := base64.RawStdEncoding.DecodeString(rawInput); err == nil {
		if k := keyFromBytes(b); k != nil {
			return k, nil
		}
	}
	if b, err := base64.StdEncoding.DecodeString(rawInput); err == nil {
		if k := keyFromBytes(b); k != nil {
			return k, nil
		}
	}

	// 3. Try Hex decoding
	if b, err := hex.DecodeString(rawInput); err == nil {
		if k := keyFromBytes(b); k != nil {
			return k, nil
		}
	}

	return nil, fmt.Errorf("invalid private key format: must be 32-byte seed or 64-byte private key in Base64URL or Hex")
}

func keyFromBytes(b []byte) ed25519.PrivateKey {
	if len(b) == ed25519.SeedSize {
		return ed25519.NewKeyFromSeed(b)
	}
	if len(b) == ed25519.PrivateKeySize {
		return ed25519.PrivateKey(b)
	}
	return nil
}

// GenerateRandomNonce returns 16 cryptographically random bytes.
func GenerateRandomNonce() ([16]byte, error) {
	var n [16]byte
	if _, err := io.ReadFull(rand.Reader, n[:]); err != nil {
		return n, fmt.Errorf("failed to generate random nonce: %w", err)
	}
	return n, nil
}
