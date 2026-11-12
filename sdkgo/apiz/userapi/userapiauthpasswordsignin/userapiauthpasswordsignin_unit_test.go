package userapiauthpasswordsignin_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthpasswordsignin"
)

func TestUnitUserAuthPasswordSignInApi(t *testing.T) {
	api := &userapiauthpasswordsignin.Api{
		Req: userapiauthpasswordsignin.Req{
			Email:         "alice@infinity6.ai",
			Password:      "pass123",
			CodeChallenge: "challenge-xyz",
			App:           "decsuite",
		},
		Resp: userapiauthpasswordsignin.Resp{
			Code: "auth-code-123",
		},
	}

	spec := api.ApiSpec()
	require.Equal(t, "user-auth-password-signin", spec.Id)
	require.Equal(t, "POST", spec.Method)
	require.Equal(t, "/api/userz/auth/signin/password", spec.Path)
	require.Equal(t, "userz", spec.Desc().Labels["servname"])

	refs := api.ApiDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.ReqBody)
	require.NotNil(t, refs.RespBody)
}
