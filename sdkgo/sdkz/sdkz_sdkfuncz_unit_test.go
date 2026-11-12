package sdkz_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkz"
)

func TestUnitSdkFuncs(t *testing.T) {
	funcs := sdkz.SdkFuncs()
	require.NotEmpty(t, funcs)

	f := sdkz.SdkFunc("product-relevance-fashion-fbt")
	require.NotNil(t, f)
	require.Equal(t, "product-relevance-fashion-fbt", f.SdkFuncSpec().Id)
	require.Equal(t, "v1", f.SdkFuncSpec().Version)
	require.Equal(t, sdkfuncz.TypClientInfer, f.SdkFuncSpec().Typ)

	// Test aliases
	sdkFuncs := sdkz.SdkFuncs()
	require.Equal(t, len(funcs), len(sdkFuncs))

	sdkFunc := sdkz.SdkFunc("product-relevance-fashion-fbt")
	require.Equal(t, f, sdkFunc)
}
