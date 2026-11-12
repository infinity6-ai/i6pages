package userapiauthdevicecode_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthdevicecode"
)

func TestUnitUserAuthDeviceCodeApi(t *testing.T) {
	ctx := t.Context()
	api := &userapiauthdevicecode.Api{
		Req: userapiauthdevicecode.Req{
			App: "i6-cli",
		},
		Resp: userapiauthdevicecode.Resp{
			DeviceCode:              "dev-code-secret-123",
			UserCode:                "WDJB-MJHT",
			VerificationUri:         "https://auth.infinity6.ai/activate",
			VerificationUriComplete: "https://auth.infinity6.ai/activate?code=WDJB-MJHT",
			ExpiresInSec:            900,
			IntervalSec:             5,
		},
	}

	apiCopy := jsonz.MustCopy(api, &userapiauthdevicecode.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "user-auth-device-code", parsed.Spec.Id)
}
