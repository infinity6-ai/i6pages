package cmdsign

import (
	"encoding/hex"
	"fmt"
	"os"
	"strings"
	"time"

	"github.com/spf13/cobra"
)

func newSignAssertionCmd() *cobra.Command {
	var (
		keyStr       string
		method       string
		path         string
		query        string
		rawBody      string
		expEpoch     int64
		ttlStr       string
		nonceStr     string
		unsignedBody bool
		quiet        bool
		showCurl     bool
	)

	cmd := &cobra.Command{
		Use:   "assertion",
		Short: "sign a standalone refresh assertion for POST /api/userz/refresh-dataset",
		Example: `  # Sign a refresh assertion using a refresh token private key:
  go run ./main.go sign assertion --key @refresh_priv.key

  # Output raw 162-char Base64URL string for scripts:
  ASSERTION=$(go run ./main.go sign assertion -k @refresh_priv.key --quiet)
  curl -X POST https://api.infinity6.ai/api/userz/refresh-dataset \
    -H "X-I6-Signature: $ASSERTION" \
    -H "Content-Type: application/json" \
    -d '{"dataset":"ds1"}'`,
		RunE: func(cmd *cobra.Command, args []string) error {
			if keyStr == "" {
				return fmt.Errorf("missing required flag: --key / -k")
			}

			privKey, err := ParsePrivateKey(keyStr)
			if err != nil {
				return fmt.Errorf("invalid private key: %w", err)
			}

			bodyBytes := []byte(rawBody)
			if strings.HasPrefix(rawBody, "@") {
				fBytes, err := os.ReadFile(rawBody[1:])
				if err != nil {
					return fmt.Errorf("failed to read body file: %w", err)
				}
				bodyBytes = fBytes
			}

			var exp uint64
			if expEpoch > 0 {
				exp = uint64(expEpoch)
			} else {
				ttl := 2 * time.Minute
				if ttlStr != "" {
					parsedTtl, err := time.ParseDuration(ttlStr)
					if err != nil {
						return fmt.Errorf("invalid ttl duration: %w", err)
					}
					ttl = parsedTtl
				}
				exp = uint64(time.Now().Add(ttl).Unix())
			}

			var nonce [16]byte
			switch strings.ToLower(strings.TrimSpace(nonceStr)) {
			case "", "zero", "zeros":
				nonce = [16]byte{}
			case "random":
				rnd, err := GenerateRandomNonce()
				if err != nil {
					return err
				}
				nonce = rnd
			default:
				b, err := hex.DecodeString(nonceStr)
				if err != nil || len(b) != 16 {
					return fmt.Errorf("invalid nonce: must be 'random', 'zero', or a 32-character hex string")
				}
				copy(nonce[:], b)
			}

			assertion, err := SignRefreshAssertion(privKey, method, path, query, bodyBytes, exp, nonce, unsignedBody)
			if err != nil {
				return err
			}

			if quiet {
				fmt.Println(assertion.AssertionBase64)
				return nil
			}

			fmt.Println("================================================================================")
			fmt.Println("                  INFINITY6 REFRESH ASSERTION SIGNING RESULT                    ")
			fmt.Println("================================================================================")
			fmt.Printf("HTTP Method:       %s\n", strings.ToUpper(method))
			fmt.Printf("Path:              %s\n", path)
			fmt.Printf("Public Key (JTI):  %s\n", assertion.PublicKeyBase64)
			fmt.Printf("Expires At (Unix): %d (%s)\n", assertion.Exp, time.Unix(int64(assertion.Exp), 0).UTC().Format(time.RFC3339))
			fmt.Printf("Nonce (Hex):       %s\n", hex.EncodeToString(assertion.Nonce[:]))
			fmt.Printf("Unsigned Body:     %t\n", unsignedBody)
			fmt.Println("--------------------------------------------------------------------------------")
			fmt.Println("CANONICAL STRING (7 lines signed by Ed25519):")
			for i, line := range strings.Split(assertion.CanonicalString, "\n") {
				lineName := canonicalLineDesc(i)
				fmt.Printf("  [%d] %-18s: %q\n", i+1, lineName, line)
			}
			fmt.Println("--------------------------------------------------------------------------------")
			fmt.Println("Refresh Assertion (121 bytes binary -> 162 Base64URL chars):")
			fmt.Printf("  %s\n", assertion.AssertionBase64)
			fmt.Println("================================================================================")

			if showCurl {
				fmt.Println("\nExample curl command to refresh dataset access token:")
				fmt.Printf("curl -X POST https://api.infinity6.ai/api/userz/refresh-dataset \\\n")
				fmt.Printf("  -H %q \\\n", fmt.Sprintf("X-I6-Signature: %s", assertion.AssertionBase64))
				fmt.Printf("  -H \"Content-Type: application/json\" \\\n")
				fmt.Printf("  -d '{\"dataset\":\"<your-dataset>\"}'\n")
			}

			return nil
		},
	}

	cmd.Flags().StringVarP(&keyStr, "key", "k", "", "Ed25519 private key (Base64URL, Hex, or @filepath)")
	cmd.Flags().StringVarP(&method, "method", "m", "POST", "HTTP method (typically POST)")
	cmd.Flags().StringVarP(&path, "path", "p", "/api/userz/refresh-dataset", "Request path")
	cmd.Flags().StringVarP(&query, "query", "q", "", "Query string")
	cmd.Flags().StringVarP(&rawBody, "body", "b", "", "Request body string or @filepath")
	cmd.Flags().Int64Var(&expEpoch, "exp", 0, "Expiration Unix epoch timestamp in seconds")
	cmd.Flags().StringVar(&ttlStr, "ttl", "2m", "Expiration TTL duration from now")
	cmd.Flags().StringVar(&nonceStr, "nonce", "random", "Nonce: 'random', 'zero', or 32-char hex")
	cmd.Flags().BoolVar(&unsignedBody, "unsigned-body", true, "Permit any body (default true for refresh assertion)")
	cmd.Flags().BoolVarP(&quiet, "quiet", "s", false, "Print ONLY the raw 162-char assertion value")
	cmd.Flags().BoolVar(&showCurl, "curl", true, "Print ready-to-run curl example")

	return cmd
}
