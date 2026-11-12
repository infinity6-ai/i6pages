package userapiauthpasswordreset_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthpasswordreset"
)

func TestUnitUserAuthPasswordResetApi(t *testing.T) {
	api := &userapiauthpasswordreset.Api{
		Req: userapiauthpasswordreset.Req{
			Email: "carol@infinity6.ai",
		},
		Resp: userapiauthpasswordreset.Resp{
			Status: "password_reset_email_sent",
			Email:  "carol@infinity6.ai",
		},
	}

	spec := api.ApiSpec()
	require.Equal(t, "user-auth-password-reset", spec.Id)
	require.Equal(t, "POST", spec.Method)
	require.Equal(t, "/api/userz/auth/password/reset", spec.Path)
	require.Equal(t, "userz", spec.Desc().Labels["servname"])

	refs := api.ApiDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.ReqBody)
	require.NotNil(t, refs.RespBody)
}
