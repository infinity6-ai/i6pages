package cmdsign_test

import (
	"bytes"
	"context"
	"crypto/ed25519"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"os"
	"path/filepath"
	"testing"
	"time"

	"github.com/spf13/cobra"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/internal/cmd/cmdsign"
	"go.code.infinity6.ai/sdkgo/sdkgo/reqsign"
)

func TestUnitPureSigningInteroperability(t *testing.T) {
	pubKey, privKey, err := ed25519.GenerateKey(rand.Reader)
	require.NoError(t, err)

	privB64 := base64.RawURLEncoding.EncodeToString(privKey)
	method := "POST"
	reqPath := "/api/datasetmanager/dataset/ds-test/query"
	query := "view=detailed&sort=asc&i6_sig=ignore_me"
	body := []byte(`{"limit": 100, "offset": 0}`)
	accessToken := "dummy-access-token-12345"
	exp := uint64(time.Now().Add(5 * time.Minute).Unix())
	nonce, err := cmdsign.GenerateRandomNonce()
	require.NoError(t, err)

	t.Run("Pure SignRequest generates signature verified by reqsign.Unpack and token.Verify", func(t *testing.T) {
		sig, err := cmdsign.SignRequest(privKey, method, reqPath, query, body, accessToken, exp, nonce, false)
		require.NoError(t, err)
		require.NotEmpty(t, sig.EnvelopeBase64)
		require.Equal(t, 119, len(sig.EnvelopeBase64), "89 bytes binary envelope must be 119 Base64URL chars")
		require.Contains(t, sig.HeaderValue, "."+accessToken)

		// Verify using reqsign package (which is deployed in microservices)
		tok, err := reqsign.Unpack(sig.HeaderValue)
		require.NoError(t, err)
		require.Equal(t, accessToken, tok.AccessToken)
		require.Equal(t, exp, tok.Exp)
		require.Equal(t, nonce, tok.Nonce)

		err = tok.Verify(pubKey, method, reqPath, query, body)
		require.NoError(t, err, "reqsign.Verify must accept pure Go signature")
	})

	t.Run("Pure SignRequest with unsigned body verified by reqsign", func(t *testing.T) {
		sig, err := cmdsign.SignRequest(privKey, "GET", "/api/data", "", nil, accessToken, exp, [16]byte{}, true)
		require.NoError(t, err)

		tok, err := reqsign.Unpack(sig.HeaderValue)
		require.NoError(t, err)
		require.True(t, tok.UnsignedBody)
		require.True(t, tok.IsTimeWindowed())

		// Any body should verify when unsignedBody is true
		err = tok.Verify(pubKey, "GET", "/api/data", "", []byte("arbitrary-body"))
		require.NoError(t, err)
	})

	t.Run("Pure SignRefreshAssertion verified by reqsign.UnpackAssertion and unpacked.Verify", func(t *testing.T) {
		assertion, err := cmdsign.SignRefreshAssertion(privKey, "POST", "/api/userz/refresh-dataset", "", nil, exp, nonce, true)
		require.NoError(t, err)
		require.Equal(t, 162, len(assertion.AssertionBase64), "121 bytes binary assertion must be 162 Base64URL chars")

		parsedAssertion, err := reqsign.UnpackAssertion(assertion.AssertionBase64)
		require.NoError(t, err)
		require.Equal(t, pubKey, ed25519.PublicKey(parsedAssertion.PublicKey[:]))
		require.Equal(t, exp, parsedAssertion.Exp)
		require.Equal(t, nonce, parsedAssertion.Nonce)

		err = parsedAssertion.Verify("POST", "/api/userz/refresh-dataset", "", nil)
		require.NoError(t, err)
	})

	t.Run("ParsePrivateKey parses 32-byte seed, 64-byte key, hex, and file reference", func(t *testing.T) {
		// 1. 64-byte base64url
		k1, err := cmdsign.ParsePrivateKey(privB64)
		require.NoError(t, err)
		require.Equal(t, privKey, k1)

		// 2. 32-byte seed base64url
		seedB64 := base64.RawURLEncoding.EncodeToString(privKey.Seed())
		k2, err := cmdsign.ParsePrivateKey(seedB64)
		require.NoError(t, err)
		require.Equal(t, privKey, k2)

		// 3. Hex string
		hexKey := hex.EncodeToString(privKey)
		k3, err := cmdsign.ParsePrivateKey(hexKey)
		require.NoError(t, err)
		require.Equal(t, privKey, k3)

		// 4. File with @ prefix
		tmpDir := t.TempDir()
		keyFile := filepath.Join(tmpDir, "key.txt")
		err = os.WriteFile(keyFile, []byte(privB64+"\n"), 0600)
		require.NoError(t, err)

		k4, err := cmdsign.ParsePrivateKey("@" + keyFile)
		require.NoError(t, err)
		require.Equal(t, privKey, k4)
	})
}

func TestUnitSignCliCommands(t *testing.T) {
	_, privKey, err := ed25519.GenerateKey(rand.Reader)
	require.NoError(t, err)
	privB64 := base64.RawURLEncoding.EncodeToString(privKey)

	t.Run("keygen command generates keys without error", func(t *testing.T) {
		root := &cobra.Command{Use: "test"}
		cmdsign.Prepare(root)

		var outBuf bytes.Buffer
		root.SetOut(&outBuf)
		root.SetArgs([]string{"sign", "keygen"})

		err := root.Execute()
		require.NoError(t, err)
	})

	t.Run("request command with --quiet prints valid header", func(t *testing.T) {
		root := &cobra.Command{Use: "test"}
		cmdsign.Prepare(root)

		root.SetArgs([]string{
			"sign", "request",
			"-k", privB64,
			"-u", "https://api.infinity6.ai/api/datasetmanager/data?view=all",
			"-t", "test-access-token",
			"--quiet",
		})

		err := root.Execute()
		require.NoError(t, err)
	})

	t.Run("assertion command with --quiet prints 162-char assertion", func(t *testing.T) {
		root := &cobra.Command{Use: "test"}
		cmdsign.Prepare(root)

		root.SetArgs([]string{
			"sign", "assertion",
			"-k", privB64,
			"--quiet",
		})

		err := root.Execute()
		require.NoError(t, err)
	})

	t.Run("missing key flag returns error", func(t *testing.T) {
		root := &cobra.Command{Use: "test"}
		cmdsign.Prepare(root)

		root.SetArgs([]string{"sign", "request"})
		err := root.ExecuteContext(context.Background())
		require.Error(t, err)
	})
}
