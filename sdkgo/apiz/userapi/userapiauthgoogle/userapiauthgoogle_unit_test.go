package userapiauthgoogle_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthgoogle"
)

func TestUnitUserAuthGoogleApi(t *testing.T) {
	api := &userapiauthgoogle.Api{
		Req: userapiauthgoogle.Req{
			IdToken:       "google-id-token-xyz",
			CodeChallenge: "challenge-123",
			App:           "decsuite",
		},
		Resp: userapiauthgoogle.Resp{
			Code: "auth-code-456",
		},
	}

	spec := api.ApiSpec()
	require.Equal(t, "user-auth-google", spec.Id)
	require.Equal(t, "POST", spec.Method)
	require.Equal(t, "/api/userz/auth/google", spec.Path)
	require.Equal(t, "userz", spec.Desc().Labels["servname"])

	refs := api.ApiDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.ReqBody)
	require.NotNil(t, refs.RespBody)
}
