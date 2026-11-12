package cmdsign

import (
	"crypto/ed25519"
	"crypto/rand"
	"encoding/base64"
	"encoding/hex"
	"fmt"

	"github.com/spf13/cobra"
)

func newKeygenCmd() *cobra.Command {
	return &cobra.Command{
		Use:   "keygen",
		Short: "generate an Ed25519 keypair for test and development",
		RunE: func(cmd *cobra.Command, args []string) error {
			pubKey, privKey, err := ed25519.GenerateKey(rand.Reader)
			if err != nil {
				return fmt.Errorf("failed to generate key: %w", err)
			}

			pubB64 := base64.RawURLEncoding.EncodeToString(pubKey)
			privB64 := base64.RawURLEncoding.EncodeToString(privKey)
			seedB64 := base64.RawURLEncoding.EncodeToString(privKey.Seed())

			fmt.Println("================================================================================")
			fmt.Println("                        NEW ED25519 KEYPAIR GENERATED                           ")
			fmt.Println("================================================================================")
			fmt.Printf("Public Key (JTI / Base64URL - 32B):   %s\n", pubB64)
			fmt.Printf("Private Key (Base64URL - 64B):        %s\n", privB64)
			fmt.Printf("Seed Only (Base64URL - 32B):          %s\n", seedB64)
			fmt.Println("--------------------------------------------------------------------------------")
			fmt.Printf("Public Key (Hex):  %s\n", hex.EncodeToString(pubKey))
			fmt.Printf("Private Key (Hex): %s\n", hex.EncodeToString(privKey))
			fmt.Println("================================================================================")
			return nil
		},
	}
}
