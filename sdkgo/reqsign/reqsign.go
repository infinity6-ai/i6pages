package reqsign

import (
	"crypto/ed25519"
	"crypto/subtle"
	"encoding/binary"
	"encoding/hex"
	"fmt"
	"net/url"
	"sort"
	"strconv"
	"strings"
	"time"

	"github.com/infinity6-ai/gox/commonz/encz/enczb64"
	"github.com/infinity6-ai/gox/commonz/pathz"
	"github.com/infinity6-ai/gox/cryptz/cryptz25519"
	"github.com/infinity6-ai/gox/cryptz/cryptzhash"
)

// TokenType represents the 1-byte binary wire type identifier.
type TokenType uint8

const (
	TypeDatasetAccess    TokenType = 1 // Binary dataset access execution tokens (Type 1)
	TypeSigEnvelope      TokenType = 2 // Composite request signature envelopes (Type 2)
	TypeRefreshAssertion TokenType = 3 // Standalone refresh assertion tokens (Type 3)

	// FlagUnsignedBody is Bit 7 of Byte 0; if set (1), any request body is allowed.
	FlagUnsignedBody uint8 = 1 << 7 // 0x80

	// EnvelopeLen is the fixed 89-byte binary length of a SigEnvelope.
	EnvelopeLen = 1 + 8 + 16 + 64 // 89 bytes

	// EnvelopeB64Len is the unpadded Base64URL length of an EnvelopeLen buffer.
	EnvelopeB64Len = 119 // Base64URL chars

	// AssertionLen is the fixed 121-byte binary length of a RefreshAssertion.
	AssertionLen = 1 + 8 + 16 + 32 + 64 // 121 bytes

	// AssertionB64Len is the unpadded Base64URL length of an AssertionLen buffer.
	AssertionB64Len = 162 // Base64URL chars
)

// EmptyBodySHA256 is the lowercase 64-char hex-encoded SHA-256 digest of an empty payload.
const EmptyBodySHA256 = "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

// EmptyBodyHash is the raw 32-byte SHA-256 binary digest of an empty payload.
var EmptyBodyHash = [32]byte{
	0xe3, 0xb0, 0xc4, 0x42, 0x98, 0xfc, 0x1c, 0x14,
	0x9a, 0xfb, 0xf4, 0xc8, 0x99, 0x6f, 0xb9, 0x24,
	0x27, 0xae, 0x41, 0xe4, 0x64, 0x9b, 0x93, 0x4c,
	0xa4, 0x95, 0x99, 0x1b, 0x78, 0x52, 0xb8, 0x55,
}

// Token represents the 89-byte binary signature envelope bundled with an access token (<sig_envelope>.<access_token>).
type Token struct {
	Type         TokenType
	UnsignedBody bool
	Exp          uint64
	Nonce        [16]byte
	Signature    [64]byte
	AccessToken  string
}

// IsTimeWindowed reports whether the token uses time-windowed replay mode (nonce is all zeros).
func (t *Token) IsTimeWindowed() bool {
	var zeroNonce [16]byte
	return subtle.ConstantTimeCompare(t.Nonce[:], zeroNonce[:]) == 1
}

// NonceHex returns the 32-character lowercase hex string of the nonce.
func (t *Token) NonceHex() string {
	return hex.EncodeToString(t.Nonce[:])
}

// Pack encodes the Token into the single-header composite wire format: <envelope_89B>.<accessToken>.
func (t *Token) Pack() string {
	var buf [EnvelopeLen]byte
	v := uint8(t.Type)
	if t.UnsignedBody {
		v |= FlagUnsignedBody
	}
	buf[0] = v

	binary.BigEndian.PutUint64(buf[1:9], t.Exp)
	copy(buf[9:25], t.Nonce[:])
	copy(buf[25:89], t.Signature[:])

	envB64 := enczb64.UrlEncode(buf[:]).String()
	if t.AccessToken == "" {
		return envB64
	}
	return envB64 + "." + t.AccessToken
}

// Unpack decodes the composite string format (<envelope_89B>.<accessToken>) into a Token.
func Unpack(tokenStr string) (*Token, error) {
	parts := strings.SplitN(tokenStr, ".", 2)
	if len(parts) != 2 {
		return nil, fmt.Errorf("invalid token format: expected <sig_envelope>.<access_token>")
	}
	if parts[1] == "" {
		return nil, fmt.Errorf("invalid token format: access token component cannot be empty")
	}

	rawEnvBlob, err := enczb64.UrlDecode(parts[0])
	if err != nil {
		return nil, fmt.Errorf("invalid base64url envelope: %w", err)
	}
	rawEnv := rawEnvBlob.Bytes()
	if len(rawEnv) != EnvelopeLen {
		return nil, fmt.Errorf("invalid envelope length: expected %d bytes, got %d", EnvelopeLen, len(rawEnv))
	}

	tokType := TokenType(rawEnv[0] & 0x0F)
	if tokType != TypeSigEnvelope {
		return nil, fmt.Errorf("token_type_mismatch: expected TypeSigEnvelope (%d), got %d", TypeSigEnvelope, tokType)
	}

	t := &Token{
		Type:         tokType,
		UnsignedBody: (rawEnv[0] & FlagUnsignedBody) != 0,
		Exp:          binary.BigEndian.Uint64(rawEnv[1:9]),
		AccessToken:  parts[1],
	}
	copy(t.Nonce[:], rawEnv[9:25])
	copy(t.Signature[:], rawEnv[25:89])

	return t, nil
}

// BuildCanonicalString constructs the canonical HTTP request byte stream for Ed25519 signing or verification.
func BuildCanonicalString(method, path, query string, bodyBytes []byte, accessToken string, exp uint64, nonce [16]byte, unsignedBody bool) (string, error) {
	var bodyHash string
	if !unsignedBody {
		h, err := cryptzhash.SHA256Data(bodyBytes)
		if err != nil {
			return "", fmt.Errorf("canonicalization_error: failed to hash body: %w", err)
		}
		bodyHash = hex.EncodeToString(h)
	}
	return BuildCanonicalStringWithBodyHash(method, path, query, bodyHash, accessToken, exp, nonce, unsignedBody)
}

// BuildCanonicalStringWithBodyHash constructs the canonical HTTP request byte stream using a precomputed hex-encoded body SHA-256 digest.
func BuildCanonicalStringWithBodyHash(method, path, query, bodyHash, accessToken string, exp uint64, nonce [16]byte, unsignedBody bool) (string, error) {
	if strings.ContainsAny(method, "\r\n") || strings.ContainsAny(path, "\r\n") || strings.ContainsAny(query, "\r\n") {
		return "", fmt.Errorf("canonicalization_error: path or query contains illegal newline characters")
	}

	normMethod := strings.ToUpper(strings.TrimSpace(method))
	if normMethod == "" {
		return "", fmt.Errorf("canonicalization_error: method cannot be empty")
	}

	normPath := strings.TrimSpace(path)
	if normPath == "" {
		normPath = "/"
	} else if len(normPath) > 1 && strings.HasSuffix(normPath, "/") {
		normPath = strings.TrimSuffix(normPath, "/")
	}

	canonicalQuery := ""
	query = strings.TrimPrefix(strings.TrimSpace(query), "?")
	if query != "" {
		vals, err := url.ParseQuery(query)
		if err != nil {
			return "", fmt.Errorf("canonicalization_error: invalid query string: %w", err)
		}
		vals.Del("i6_sig")

		keys := make([]string, 0, len(vals))
		for k := range vals {
			keys = append(keys, k)
		}
		sort.Strings(keys)

		var parts []string
		for _, k := range keys {
			vs := vals[k]
			sort.Strings(vs)
			encK := url.QueryEscape(k)
			for _, v := range vs {
				parts = append(parts, encK+"="+url.QueryEscape(v))
			}
		}
		canonicalQuery = strings.Join(parts, "&")
	}

	normBodyHash := ""
	if !unsignedBody {
		normBodyHash = strings.ToLower(strings.TrimSpace(bodyHash))
	}

	var tokenHash string
	if accessToken != "" {
		hToken, err := cryptzhash.SHA256Data(accessToken)
		if err != nil {
			return "", fmt.Errorf("canonicalization_error: failed to hash access token: %w", err)
		}
		tokenHash = hex.EncodeToString(hToken)
	}

	expStr := strconv.FormatUint(exp, 10)
	nonceHex := hex.EncodeToString(nonce[:])

	return fmt.Sprintf("%s\n%s\n%s\n%s\n%s\n%s\n%s",
		normMethod, normPath, canonicalQuery, normBodyHash, tokenHash, expStr, nonceHex), nil
}

// Sign signs an HTTP request canonical string with the given Ed25519 private key and returns a composite Token.
func Sign(privKey ed25519.PrivateKey, method, path, query string, bodyBytes []byte, accessToken string, exp uint64, nonce [16]byte, unsignedBody bool) (*Token, error) {
	var bodyHash string
	if !unsignedBody {
		h, err := cryptzhash.SHA256Data(bodyBytes)
		if err != nil {
			return nil, fmt.Errorf("failed to hash body: %w", err)
		}
		bodyHash = hex.EncodeToString(h)
	}
	return SignWithBodyHash(privKey, method, path, query, bodyHash, accessToken, exp, nonce, unsignedBody)
}

// SignWithBodyHash signs an HTTP request using a precomputed hex-encoded body SHA-256 digest and returns a composite Token.
func SignWithBodyHash(privKey ed25519.PrivateKey, method, path, query, bodyHash, accessToken string, exp uint64, nonce [16]byte, unsignedBody bool) (*Token, error) {
	if len(privKey) != ed25519.PrivateKeySize {
		return nil, fmt.Errorf("invalid ed25519 private key size: expected %d, got %d", ed25519.PrivateKeySize, len(privKey))
	}

	canonicalStr, err := BuildCanonicalStringWithBodyHash(method, path, query, bodyHash, accessToken, exp, nonce, unsignedBody)
	if err != nil {
		return nil, fmt.Errorf("failed to build canonical string: %w", err)
	}

	sig := cryptz25519.NewService().Sign(privKey, []byte(canonicalStr))
	var sigBytes [64]byte
	copy(sigBytes[:], sig)

	return &Token{
		Type:         TypeSigEnvelope,
		UnsignedBody: unsignedBody,
		Exp:          exp,
		Nonce:        nonce,
		Signature:    sigBytes,
		AccessToken:  accessToken,
	}, nil
}

// Verify verifies the Ed25519 signature of the composite Token against the client's public key.
func (t *Token) Verify(pubKey ed25519.PublicKey, method, path, query string, bodyBytes []byte) error {
	var bodyHash string
	if !t.UnsignedBody {
		h, err := cryptzhash.SHA256Data(bodyBytes)
		if err != nil {
			return fmt.Errorf("failed to hash body: %w", err)
		}
		bodyHash = hex.EncodeToString(h)
	}
	return t.VerifyWithBodyHash(pubKey, method, path, query, bodyHash)
}

// VerifyWithBodyHash verifies the Ed25519 signature of the composite Token using a precomputed body SHA-256 digest.
func (t *Token) VerifyWithBodyHash(pubKey ed25519.PublicKey, method, path, query, bodyHash string) error {
	if len(pubKey) != ed25519.PublicKeySize {
		return fmt.Errorf("invalid ed25519 public key size: expected %d, got %d", ed25519.PublicKeySize, len(pubKey))
	}

	canonicalStr, err := BuildCanonicalStringWithBodyHash(method, path, query, bodyHash, t.AccessToken, t.Exp, t.Nonce, t.UnsignedBody)
	if err != nil {
		return fmt.Errorf("failed to build canonical string: %w", err)
	}

	if !cryptz25519.NewService().Verify(pubKey, []byte(canonicalStr), t.Signature[:]) {
		return fmt.Errorf("invalid_signature: ed25519 signature verification failed")
	}

	return nil
}

// RefreshAssertion represents the standalone 121-byte token used for POST /api/userz/dataset/refresh.
type RefreshAssertion struct {
	Type         TokenType
	UnsignedBody bool
	Exp          uint64
	Nonce        [16]byte
	PublicKey    [32]byte
	Signature    [64]byte
}

// IsTimeWindowed reports whether the assertion uses time-windowed replay mode (nonce is all zeros).
func (a *RefreshAssertion) IsTimeWindowed() bool {
	var zeroNonce [16]byte
	return subtle.ConstantTimeCompare(a.Nonce[:], zeroNonce[:]) == 1
}

// NonceHex returns the 32-character lowercase hex string of the nonce.
func (a *RefreshAssertion) NonceHex() string {
	return hex.EncodeToString(a.Nonce[:])
}

// Pack encodes the RefreshAssertion into a 162-character Base64URL string (121 raw bytes).
func (a *RefreshAssertion) Pack() string {
	var buf [AssertionLen]byte
	v := uint8(a.Type)
	if a.UnsignedBody {
		v |= FlagUnsignedBody
	}
	buf[0] = v

	binary.BigEndian.PutUint64(buf[1:9], a.Exp)
	copy(buf[9:25], a.Nonce[:])
	copy(buf[25:57], a.PublicKey[:])
	copy(buf[57:121], a.Signature[:])

	return enczb64.UrlEncode(buf[:]).String()
}

// UnpackAssertion decodes the 162-char Base64URL string into the 121-byte RefreshAssertion struct.
func UnpackAssertion(assertionStr string) (*RefreshAssertion, error) {
	assertionStr = strings.TrimSpace(assertionStr)
	if assertionStr == "" {
		return nil, fmt.Errorf("assertion string cannot be empty")
	}

	rawBlob, err := enczb64.UrlDecode(assertionStr)
	if err != nil {
		return nil, fmt.Errorf("invalid base64url assertion: %w", err)
	}
	raw := rawBlob.Bytes()
	if len(raw) != AssertionLen {
		return nil, fmt.Errorf("invalid assertion length: expected %d bytes, got %d", AssertionLen, len(raw))
	}

	tokType := TokenType(raw[0] & 0x0F)
	if tokType != TypeRefreshAssertion {
		return nil, fmt.Errorf("token_type_mismatch: expected TypeRefreshAssertion (%d), got %d", TypeRefreshAssertion, tokType)
	}

	a := &RefreshAssertion{
		Type:         tokType,
		UnsignedBody: (raw[0] & FlagUnsignedBody) != 0,
		Exp:          binary.BigEndian.Uint64(raw[1:9]),
	}
	copy(a.Nonce[:], raw[9:25])
	copy(a.PublicKey[:], raw[25:57])
	copy(a.Signature[:], raw[57:121])

	return a, nil
}

// SignAssertion signs a standalone refresh request with the customer's private key.
func SignAssertion(privKey ed25519.PrivateKey, method, path, query string, bodyBytes []byte, exp uint64, nonce [16]byte, unsignedBody bool) (*RefreshAssertion, error) {
	if len(privKey) != ed25519.PrivateKeySize {
		return nil, fmt.Errorf("invalid ed25519 private key size: expected %d, got %d", ed25519.PrivateKeySize, len(privKey))
	}

	canonicalStr, err := BuildCanonicalString(method, path, query, bodyBytes, "", exp, nonce, unsignedBody)
	if err != nil {
		return nil, fmt.Errorf("failed to build canonical string: %w", err)
	}

	sig := cryptz25519.NewService().Sign(privKey, []byte(canonicalStr))
	var sigBytes [64]byte
	copy(sigBytes[:], sig)

	pubKey := privKey.Public().(ed25519.PublicKey)
	var pubKeyBytes [32]byte
	copy(pubKeyBytes[:], pubKey)

	return &RefreshAssertion{
		Type:         TypeRefreshAssertion,
		UnsignedBody: unsignedBody,
		Exp:          exp,
		Nonce:        nonce,
		PublicKey:    pubKeyBytes,
		Signature:    sigBytes,
	}, nil
}

// Verify verifies the Ed25519 signature of the RefreshAssertion against the public key stored inside it.
func (a *RefreshAssertion) Verify(method, path, query string, bodyBytes []byte) error {
	var bodyHash string
	if !a.UnsignedBody {
		h, err := cryptzhash.SHA256Data(bodyBytes)
		if err != nil {
			return fmt.Errorf("failed to hash body: %w", err)
		}
		bodyHash = hex.EncodeToString(h)
	}
	return a.VerifyWithBodyHash(method, path, query, bodyHash)
}

// VerifyWithBodyHash verifies the Ed25519 signature of the RefreshAssertion using a precomputed body SHA-256 digest.
func (a *RefreshAssertion) VerifyWithBodyHash(method, path, query, bodyHash string) error {
	canonicalStr, err := BuildCanonicalStringWithBodyHash(method, path, query, bodyHash, "", a.Exp, a.Nonce, a.UnsignedBody)
	if err != nil {
		return fmt.Errorf("failed to build canonical string: %w", err)
	}

	pubKey := ed25519.PublicKey(a.PublicKey[:])
	if !cryptz25519.NewService().Verify(pubKey, []byte(canonicalStr), a.Signature[:]) {
		return fmt.Errorf("invalid_signature: ed25519 signature verification failed")
	}

	return nil
}

// RequestSignatureData contains the HTTP request details and the bound access token to sign.
type RequestSignatureData struct {
	Method      string      // HTTP method (e.g. "GET", "POST")
	Path        *pathz.Path // Request path (e.g. pathz.MustParse("/api/relevance/dataset/ds-acme/predict"))
	Query       url.Values  // URL query parameters
	BodyHash    []byte      // Exactly 32 binary bytes representing the SHA-256 hash of the request body (ignored if UnsignedBody is true)
	AccessToken string      // Binary dataset access token (or dataset signature token)
}

// RequestSignatureOptions specifies signing credentials and optional parameters.
type RequestSignatureOptions struct {
	PrivKey      ed25519.PrivateKey // Customer Ed25519 private key (from dataset_refresh_token)
	TTL          time.Duration      // Allowed lifetime (defaults to 5 minutes, capped at 5 minutes)
	Nonce        [16]byte           // Optional anti-replay nonce (defaults to 16 zero bytes for time-windowed mode)
	UnsignedBody bool               // If true, body SHA-256 is not enforced
}

// BuildRequestSignatureData is an alias for RequestSignatureData.
type BuildRequestSignatureData = RequestSignatureData

// BuildRequestSignatureOptions is an alias for RequestSignatureOptions.
type BuildRequestSignatureOptions = RequestSignatureOptions

// BuildRequestSignature signs an HTTP request with the provided credentials and returns the formatted X-I6-Signature header value.
// It bundles the 89-byte signature envelope and the bound access token into a single composite wire token: <sig_envelope>.<access_token>.
func BuildRequestSignature(data RequestSignatureData, opts RequestSignatureOptions) (string, error) {
	if len(opts.PrivKey) != ed25519.PrivateKeySize {
		return "", fmt.Errorf("invalid ed25519 private key: expected %d bytes, got %d", ed25519.PrivateKeySize, len(opts.PrivKey))
	}
	if strings.TrimSpace(data.Method) == "" {
		return "", fmt.Errorf("method cannot be empty")
	}
	if strings.TrimSpace(data.AccessToken) == "" {
		return "", fmt.Errorf("access token cannot be empty")
	}

	pathStr := "/"
	if data.Path != nil {
		pathStr = data.Path.String()
	}

	queryStr := ""
	if data.Query != nil {
		queryStr = data.Query.Encode()
	}

	bodyHash := ""
	if !opts.UnsignedBody {
		if len(data.BodyHash) != 32 {
			return "", fmt.Errorf("body hash must be exactly 32 bytes: got %d", len(data.BodyHash))
		}
		bodyHash = hex.EncodeToString(data.BodyHash)
	}

	ttl := opts.TTL
	if ttl <= 0 {
		ttl = 5 * time.Minute
	} else if ttl > 5*time.Minute {
		ttl = 5 * time.Minute
	}

	exp := uint64(time.Now().Add(ttl).Unix())

	tok, err := SignWithBodyHash(opts.PrivKey, data.Method, pathStr, queryStr, bodyHash, data.AccessToken, exp, opts.Nonce, opts.UnsignedBody)
	if err != nil {
		return "", fmt.Errorf("failed to sign request: %w", err)
	}

	return tok.Pack(), nil
}
