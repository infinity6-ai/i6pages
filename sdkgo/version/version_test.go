package version_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/version"
)

func TestUnitVersion(t *testing.T) {
	require.NotEmpty(t, version.Version())
}
