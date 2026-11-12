package userapiauthdevicetoken_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthdevicetoken"
)

func TestUnitUserAuthDeviceTokenApi(t *testing.T) {
	ctx := t.Context()
	api := &userapiauthdevicetoken.Api{
		Req: userapiauthdevicetoken.Req{
			DeviceCode: "dev-code-secret-123",
		},
		Resp: userapiauthdevicetoken.Resp{
			UserAccessToken:  "jwt-token-abc",
			UserRefreshToken: "rt-session-def",
			UserId:           "u-1234",
			ExpiresAt:        1792933262,
			Status:           "authorized",
		},
	}

	apiCopy := jsonz.MustCopy(api, &userapiauthdevicetoken.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "user-auth-device-token", parsed.Spec.Id)
}
