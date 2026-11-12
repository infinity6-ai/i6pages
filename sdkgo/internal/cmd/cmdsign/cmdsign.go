package cmdsign

import (
	"github.com/spf13/cobra"
)

// Prepare mounts the `sign` command and its subcommands to the parent CLI.
func Prepare(parent *cobra.Command) *cobra.Command {
	signCmd := &cobra.Command{
		Use:   "sign",
		Short: "sign HTTP requests and refresh assertions using pure Go standard library",
		Long: `Infinity6 Request Signing (Proof-of-Possession / DPoP) CLI.

This command demonstrates and executes request signing using ONLY the Go standard
library without external cryptographic dependencies.

Subcommands:
  request     Sign an HTTP request for downstream microservices (X-I6-Signature)
  assertion   Sign a standalone refresh assertion for POST /api/userz/refresh-dataset
  keygen      Generate a fresh Ed25519 keypair (Private Key and Public Key/JTI)`,
	}
	parent.AddCommand(signCmd)

	signCmd.AddCommand(newSignRequestCmd())
	signCmd.AddCommand(newSignAssertionCmd())
	signCmd.AddCommand(newKeygenCmd())

	return signCmd
}

func canonicalLineDesc(idx int) string {
	names := []string{
		"METHOD",
		"PATH",
		"CANONICAL QUERY",
		"BODY SHA-256",
		"TOKEN SHA-256",
		"EXPIRATION SECONDS",
		"NONCE HEX",
	}
	if idx >= 0 && idx < len(names) {
		return names[idx]
	}
	return "UNKNOWN"
}
