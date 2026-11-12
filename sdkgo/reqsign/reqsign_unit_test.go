package reqsign_test

import (
	"crypto/ed25519"
	"crypto/rand"
	"crypto/sha256"
	"encoding/hex"
	"net/url"
	"strings"
	"testing"
	"time"

	"github.com/infinity6-ai/gox/commonz/pathz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/reqsign"
)

func TestUnitTokenPackUnpack(t *testing.T) {
	type testScenario struct {
		name         string
		unsignedBody bool
		exp          uint64
		nonce        [16]byte
		signature    [64]byte
		accessToken  string
		rawInput     string
		wantErrMsg   string
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()

		if s.rawInput != "" {
			tok, err := reqsign.Unpack(s.rawInput)
			if s.wantErrMsg != "" {
				require.Error(t, err)
				require.Contains(t, err.Error(), s.wantErrMsg)
				require.Nil(t, tok)
				return
			}
			require.NoError(t, err)
			require.NotNil(t, tok)
			return
		}

		orig := &reqsign.Token{
			Type:         reqsign.TypeSigEnvelope,
			UnsignedBody: s.unsignedBody,
			Exp:          s.exp,
			Nonce:        s.nonce,
			Signature:    s.signature,
			AccessToken:  s.accessToken,
		}

		wire := orig.Pack()
		parts := strings.SplitN(wire, ".", 2)
		require.Len(t, parts, 2)
		require.Equal(t, reqsign.EnvelopeB64Len, len(parts[0]))
		require.Equal(t, s.accessToken, parts[1])

		unpacked, err := reqsign.Unpack(wire)
		require.NoError(t, err)
		require.Equal(t, reqsign.TypeSigEnvelope, unpacked.Type)
		require.Equal(t, s.unsignedBody, unpacked.UnsignedBody)
		require.Equal(t, s.exp, unpacked.Exp)
		require.Equal(t, s.nonce, unpacked.Nonce)
		require.Equal(t, s.signature, unpacked.Signature)
		require.Equal(t, s.accessToken, unpacked.AccessToken)
		require.Equal(t, s.nonce == [16]byte{}, unpacked.IsTimeWindowed())
		require.Equal(t, hex.EncodeToString(s.nonce[:]), unpacked.NonceHex())
	}

	var dummySig [64]byte
	for i := range dummySig {
		dummySig[i] = byte(i)
	}

	var dummyNonce [16]byte
	for i := range dummyNonce {
		dummyNonce[i] = byte(0xAA + i)
	}

	t.Run("Valid composite token with signed body and random nonce", func(t *testing.T) {
		check(t, testScenario{
			unsignedBody: false,
			exp:          1792933262,
			nonce:        dummyNonce,
			signature:    dummySig,
			accessToken:  "AQAAAACp...sample_access_token",
		})
	})

	t.Run("Valid composite token with unsigned body and zero nonce (time-windowed)", func(t *testing.T) {
		check(t, testScenario{
			unsignedBody: true,
			exp:          1892933262,
			nonce:        [16]byte{},
			signature:    dummySig,
			accessToken:  "sample_dataset_access_token_123",
		})
	})

	t.Run("Invalid format missing dot separator", func(t *testing.T) {
		check(t, testScenario{
			rawInput:   "no_dot_in_token_string",
			wantErrMsg: "invalid token format",
		})
	})

	t.Run("Invalid format empty access token component", func(t *testing.T) {
		tok := &reqsign.Token{
			Type:        reqsign.TypeSigEnvelope,
			Exp:         12345,
			AccessToken: "temp",
		}
		wire := tok.Pack()
		parts := strings.Split(wire, ".")
		corrupt := parts[0] + "."

		check(t, testScenario{
			rawInput:   corrupt,
			wantErrMsg: "access token component cannot be empty",
		})
	})
}

func TestUnitRefreshAssertionPackUnpack(t *testing.T) {
	type testScenario struct {
		unsignedBody bool
		exp          uint64
		nonce        [16]byte
		pubKey       [32]byte
		signature    [64]byte
		rawInput     string
		wantErrMsg   string
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()

		if s.rawInput != "" {
			a, err := reqsign.UnpackAssertion(s.rawInput)
			if s.wantErrMsg != "" {
				require.Error(t, err)
				require.Contains(t, err.Error(), s.wantErrMsg)
				require.Nil(t, a)
				return
			}
			require.NoError(t, err)
			require.NotNil(t, a)
			return
		}

		orig := &reqsign.RefreshAssertion{
			Type:         reqsign.TypeRefreshAssertion,
			UnsignedBody: s.unsignedBody,
			Exp:          s.exp,
			Nonce:        s.nonce,
			PublicKey:    s.pubKey,
			Signature:    s.signature,
		}

		wire := orig.Pack()
		require.Equal(t, reqsign.AssertionB64Len, len(wire))

		unpacked, err := reqsign.UnpackAssertion(wire)
		require.NoError(t, err)
		require.Equal(t, reqsign.TypeRefreshAssertion, unpacked.Type)
		require.Equal(t, s.unsignedBody, unpacked.UnsignedBody)
		require.Equal(t, s.exp, unpacked.Exp)
		require.Equal(t, s.nonce, unpacked.Nonce)
		require.Equal(t, s.pubKey, unpacked.PublicKey)
		require.Equal(t, s.signature, unpacked.Signature)
		require.Equal(t, s.nonce == [16]byte{}, unpacked.IsTimeWindowed())
		require.Equal(t, hex.EncodeToString(s.nonce[:]), unpacked.NonceHex())
	}

	var dummySig [64]byte
	for i := range dummySig {
		dummySig[i] = byte(i)
	}

	var dummyNonce [16]byte
	for i := range dummyNonce {
		dummyNonce[i] = byte(0xBB + i)
	}

	var dummyPub [32]byte
	for i := range dummyPub {
		dummyPub[i] = byte(0x10 + i)
	}

	t.Run("Valid refresh assertion with nonce", func(t *testing.T) {
		check(t, testScenario{
			unsignedBody: false,
			exp:          1792933262,
			nonce:        dummyNonce,
			pubKey:       dummyPub,
			signature:    dummySig,
		})
	})

	t.Run("Valid refresh assertion time-windowed (zero nonce)", func(t *testing.T) {
		check(t, testScenario{
			unsignedBody: true,
			exp:          1892933262,
			nonce:        [16]byte{},
			pubKey:       dummyPub,
			signature:    dummySig,
		})
	})

	t.Run("Empty assertion string returns error", func(t *testing.T) {
		check(t, testScenario{
			rawInput:   "   ",
			wantErrMsg: "assertion string cannot be empty",
		})
	})
}

func TestUnitBuildCanonicalString(t *testing.T) {
	type testScenario struct {
		method       string
		path         string
		query        string
		bodyBytes    []byte
		accessToken  string
		exp          uint64
		nonce        [16]byte
		unsignedBody bool
		wantLines    []string
		wantErrMsg   string
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()

		canonical, err := reqsign.BuildCanonicalString(s.method, s.path, s.query, s.bodyBytes, s.accessToken, s.exp, s.nonce, s.unsignedBody)
		if s.wantErrMsg != "" {
			require.Error(t, err)
			require.Contains(t, err.Error(), s.wantErrMsg)
			require.Empty(t, canonical)
			return
		}

		require.NoError(t, err)
		lines := strings.Split(canonical, "\n")
		require.Len(t, lines, 7)

		for i, want := range s.wantLines {
			require.Equal(t, want, lines[i], "line %d mismatch", i+1)
		}
	}

	emptyBodyHash := "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"

	t.Run("Standard GET request with query sorting and i6_sig removal", func(t *testing.T) {
		check(t, testScenario{
			method:       "GET",
			path:         "/api/relevance/dataset/ds1/predict/",
			query:        "b=2&i6_sig=ignore_this&a=1",
			bodyBytes:    nil,
			accessToken:  "tok-123",
			exp:          1792933262,
			nonce:        [16]byte{},
			unsignedBody: false,
			wantLines: []string{
				"GET",
				"/api/relevance/dataset/ds1/predict",
				"a=1&b=2",
				emptyBodyHash,
				hex.EncodeToString(func() []byte { h := sha256.Sum256([]byte("tok-123")); return h[:] }()),
				"1792933262",
				"00000000000000000000000000000000",
			},
		})
	})

	t.Run("POST request with unsigned body allows empty body hash line", func(t *testing.T) {
		check(t, testScenario{
			method:       "post",
			path:         "",
			query:        "",
			bodyBytes:    []byte("any payload"),
			accessToken:  "",
			exp:          1892933262,
			nonce:        [16]byte{0: 0x01},
			unsignedBody: true,
			wantLines: []string{
				"POST",
				"/",
				"",
				"",
				"",
				"1892933262",
				"01000000000000000000000000000000",
			},
		})
	})

	t.Run("Rejects newline characters in method", func(t *testing.T) {
		check(t, testScenario{
			method:     "GET\r\n",
			wantErrMsg: "illegal newline characters",
		})
	})

	t.Run("Rejects newline characters in path", func(t *testing.T) {
		check(t, testScenario{
			method:     "GET",
			path:       "/api/v1\ninjection",
			wantErrMsg: "illegal newline characters",
		})
	})
}

func TestUnitSignAndVerify(t *testing.T) {
	pubKey, privKey, err := ed25519.GenerateKey(rand.Reader)
	require.NoError(t, err)

	type testScenario struct {
		signMethod   string
		signPath     string
		signQuery    string
		signBody     []byte
		accessToken  string
		exp          uint64
		nonce        [16]byte
		unsignedBody bool

		verifyMethod string
		verifyPath   string
		verifyQuery  string
		verifyBody   []byte
		verifyPubKey ed25519.PublicKey

		wantErrMsg string
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()

		tok, err := reqsign.Sign(privKey, s.signMethod, s.signPath, s.signQuery, s.signBody, s.accessToken, s.exp, s.nonce, s.unsignedBody)
		require.NoError(t, err)
		require.NotNil(t, tok)

		err = tok.Verify(s.verifyPubKey, s.verifyMethod, s.verifyPath, s.verifyQuery, s.verifyBody)
		if s.wantErrMsg != "" {
			require.Error(t, err)
			require.Contains(t, err.Error(), s.wantErrMsg)
			return
		}
		require.NoError(t, err)
	}

	t.Run("Sign and verify succeeds with exact match", func(t *testing.T) {
		check(t, testScenario{
			signMethod:   "GET",
			signPath:     "/api/test",
			signQuery:    "limit=10",
			signBody:     nil,
			accessToken:  "access-token-1",
			exp:          1792933262,
			nonce:        [16]byte{},
			unsignedBody: false,

			verifyMethod: "GET",
			verifyPath:   "/api/test",
			verifyQuery:  "limit=10",
			verifyBody:   nil,
			verifyPubKey: pubKey,
		})
	})

	t.Run("Tampered path fails verification", func(t *testing.T) {
		check(t, testScenario{
			signMethod:   "POST",
			signPath:     "/api/secure/endpoint",
			signQuery:    "",
			signBody:     []byte(`{"key":"value"}`),
			accessToken:  "access-token-1",
			exp:          1792933262,
			nonce:        [16]byte{},
			unsignedBody: false,

			verifyMethod: "POST",
			verifyPath:   "/api/different/endpoint",
			verifyQuery:  "",
			verifyBody:   []byte(`{"key":"value"}`),
			verifyPubKey: pubKey,

			wantErrMsg: "signature verification failed",
		})
	})
}

func TestUnitSignAssertionAndVerify(t *testing.T) {
	pubKey, privKey, err := ed25519.GenerateKey(rand.Reader)
	require.NoError(t, err)

	type testScenario struct {
		signMethod   string
		signPath     string
		signQuery    string
		signBody     []byte
		exp          uint64
		nonce        [16]byte
		unsignedBody bool

		verifyMethod string
		verifyPath   string
		verifyQuery  string
		verifyBody   []byte

		wantErrMsg string
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()

		a, err := reqsign.SignAssertion(privKey, s.signMethod, s.signPath, s.signQuery, s.signBody, s.exp, s.nonce, s.unsignedBody)
		require.NoError(t, err)
		require.NotNil(t, a)

		err = a.Verify(s.verifyMethod, s.verifyPath, s.verifyQuery, s.verifyBody)
		if s.wantErrMsg != "" {
			require.Error(t, err)
			require.Contains(t, err.Error(), s.wantErrMsg)
			return
		}
		require.NoError(t, err)
	}

	t.Run("Sign assertion and verify succeeds", func(t *testing.T) {
		check(t, testScenario{
			signMethod:   "POST",
			signPath:     "/api/userz/dataset/refresh",
			signQuery:    "",
			signBody:     nil,
			exp:          1792933262,
			nonce:        [16]byte{},
			unsignedBody: false,

			verifyMethod: "POST",
			verifyPath:   "/api/userz/dataset/refresh",
			verifyQuery:  "",
			verifyBody:   nil,
		})
	})

	t.Run("Tampered query in assertion fails verification", func(t *testing.T) {
		check(t, testScenario{
			signMethod:   "POST",
			signPath:     "/api/userz/dataset/refresh",
			signQuery:    "",
			signBody:     nil,
			exp:          1792933262,
			nonce:        [16]byte{},
			unsignedBody: false,

			verifyMethod: "POST",
			verifyPath:   "/api/userz/dataset/refresh",
			verifyQuery:  "tampered=1",
			verifyBody:   nil,

			wantErrMsg: "signature verification failed",
		})
	})
	_ = pubKey
}

func TestUnitBuildRequestSignature(t *testing.T) {
	pubKey, privKey, err := ed25519.GenerateKey(rand.Reader)
	require.NoError(t, err)

	type testScenario struct {
		data       reqsign.RequestSignatureData
		opts       reqsign.RequestSignatureOptions
		wantErr    bool
		errMsg     string
		checkToken func(t *testing.T, sig string)
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()
		sig, err := reqsign.BuildRequestSignature(s.data, s.opts)
		if s.wantErr {
			require.Error(t, err)
			if s.errMsg != "" {
				require.Contains(t, err.Error(), s.errMsg)
			}
			return
		}
		require.NoError(t, err)
		require.NotEmpty(t, sig)
		if s.checkToken != nil {
			s.checkToken(t, sig)
		}
	}

	t.Run("Valid signature with default options and empty body", func(t *testing.T) {
		p := pathz.MustParse("/api/relevance/dataset/ds-test/predict")
		q := url.Values{"limit": []string{"10"}}

		check(t, testScenario{
			data: reqsign.RequestSignatureData{
				Method:      "GET",
				Path:        p,
				Query:       q,
				BodyHash:    reqsign.EmptyBodyHash[:],
				AccessToken: "dummy.access.token",
			},
			opts: reqsign.RequestSignatureOptions{
				PrivKey: privKey,
			},
			checkToken: func(t *testing.T, sig string) {
				tok, err := reqsign.Unpack(sig)
				require.NoError(t, err)
				require.Equal(t, "dummy.access.token", tok.AccessToken)
				require.False(t, tok.UnsignedBody)
				require.True(t, tok.IsTimeWindowed())

				err = tok.Verify(pubKey, "GET", "/api/relevance/dataset/ds-test/predict", "limit=10", nil)
				require.NoError(t, err)
			},
		})
	})

	t.Run("Valid signature with precomputed body hash", func(t *testing.T) {
		p := pathz.MustParse("/api/dataset/items")
		bodyPayload := []byte(`{"action":"sync"}`)
		bodyHashBytes, err := hex.DecodeString("760e569083ba75fc72286a4bea7d78f2301d54079602613beb96bb9e22e8049c")
		require.NoError(t, err)

		check(t, testScenario{
			data: reqsign.RequestSignatureData{
				Method:      "POST",
				Path:        p,
				BodyHash:    bodyHashBytes,
				AccessToken: "token-abc-123",
			},
			opts: reqsign.RequestSignatureOptions{
				PrivKey: privKey,
			},
			checkToken: func(t *testing.T, sig string) {
				tok, err := reqsign.Unpack(sig)
				require.NoError(t, err)
				require.Equal(t, "token-abc-123", tok.AccessToken)

				err = tok.Verify(pubKey, "POST", "/api/dataset/items", "", bodyPayload)
				require.NoError(t, err)

				err = tok.Verify(pubKey, "POST", "/api/dataset/items", "", []byte(`{"action":"tampered"}`))
				require.Error(t, err)
			},
		})
	})

	t.Run("Valid signature with custom TTL, nonce, and unsigned body", func(t *testing.T) {
		p := pathz.MustParse("/api/dataset/items")
		var nonce [16]byte
		copy(nonce[:], []byte("nonce-test-12345"))

		check(t, testScenario{
			data: reqsign.RequestSignatureData{
				Method:      "POST",
				Path:        p,
				AccessToken: "token-abc-123",
			},
			opts: reqsign.RequestSignatureOptions{
				PrivKey:      privKey,
				TTL:          2 * time.Minute,
				Nonce:        nonce,
				UnsignedBody: true,
			},
			checkToken: func(t *testing.T, sig string) {
				tok, err := reqsign.Unpack(sig)
				require.NoError(t, err)
				require.Equal(t, "token-abc-123", tok.AccessToken)
				require.True(t, tok.UnsignedBody)
				require.False(t, tok.IsTimeWindowed())
				require.Equal(t, nonce, tok.Nonce)

				err = tok.Verify(pubKey, "POST", "/api/dataset/items", "", []byte(`{"different":"payload"}`))
				require.NoError(t, err)
			},
		})
	})

	t.Run("Nil path and nil query defaults cleanly", func(t *testing.T) {
		check(t, testScenario{
			data: reqsign.RequestSignatureData{
				Method:      "GET",
				Path:        nil,
				Query:       nil,
				BodyHash:    reqsign.EmptyBodyHash[:],
				AccessToken: "token-nil-path",
			},
			opts: reqsign.RequestSignatureOptions{
				PrivKey: privKey,
			},
			checkToken: func(t *testing.T, sig string) {
				tok, err := reqsign.Unpack(sig)
				require.NoError(t, err)

				err = tok.Verify(pubKey, "GET", "/", "", nil)
				require.NoError(t, err)
			},
		})
	})

	t.Run("Invalid body hash length returns error", func(t *testing.T) {
		check(t, testScenario{
			data: reqsign.RequestSignatureData{
				Method:      "GET",
				Path:        pathz.MustParse("/api/test"),
				BodyHash:    []byte("short"),
				AccessToken: "token-123",
			},
			opts: reqsign.RequestSignatureOptions{
				PrivKey: privKey,
			},
			wantErr: true,
			errMsg:  "body hash must be exactly 32 bytes",
		})
	})

	t.Run("Missing body hash when unsigned body is false returns error", func(t *testing.T) {
		check(t, testScenario{
			data: reqsign.RequestSignatureData{
				Method:      "GET",
				Path:        pathz.MustParse("/api/test"),
				BodyHash:    nil,
				AccessToken: "token-123",
			},
			opts: reqsign.RequestSignatureOptions{
				PrivKey: privKey,
			},
			wantErr: true,
			errMsg:  "body hash must be exactly 32 bytes",
		})
	})

	t.Run("Invalid private key returns error", func(t *testing.T) {
		check(t, testScenario{
			data: reqsign.RequestSignatureData{
				Method:      "GET",
				Path:        pathz.MustParse("/api/test"),
				AccessToken: "token-123",
			},
			opts: reqsign.RequestSignatureOptions{
				PrivKey: []byte("too-short"),
			},
			wantErr: true,
			errMsg:  "invalid ed25519 private key",
		})
	})

	t.Run("Empty method returns error", func(t *testing.T) {
		check(t, testScenario{
			data: reqsign.RequestSignatureData{
				Method:      "",
				Path:        pathz.MustParse("/api/test"),
				AccessToken: "token-123",
			},
			opts: reqsign.RequestSignatureOptions{
				PrivKey: privKey,
			},
			wantErr: true,
			errMsg:  "method cannot be empty",
		})
	})

	t.Run("Empty access token returns error", func(t *testing.T) {
		check(t, testScenario{
			data: reqsign.RequestSignatureData{
				Method:      "GET",
				Path:        pathz.MustParse("/api/test"),
				AccessToken: "   ",
			},
			opts: reqsign.RequestSignatureOptions{
				PrivKey: privKey,
			},
			wantErr: true,
			errMsg:  "access token cannot be empty",
		})
	})
}
