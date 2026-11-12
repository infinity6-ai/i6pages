package userapiauthpasswordsignup_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthpasswordsignup"
)

func TestUnitUserAuthPasswordSignUpApi(t *testing.T) {
	api := &userapiauthpasswordsignup.Api{
		Req: userapiauthpasswordsignup.Req{
			Email:    "bob@infinity6.ai",
			Password: "securePassword123",
		},
		Resp: userapiauthpasswordsignup.Resp{
			Status: "verification_email_sent",
			Email:  "bob@infinity6.ai",
		},
	}

	spec := api.ApiSpec()
	require.Equal(t, "user-auth-password-signup", spec.Id)
	require.Equal(t, "POST", spec.Method)
	require.Equal(t, "/api/userz/auth/signup/password", spec.Path)
	require.Equal(t, "userz", spec.Desc().Labels["servname"])

	refs := api.ApiDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.ReqBody)
	require.NotNil(t, refs.RespBody)
}
