package userapiauthrefresh_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthrefresh"
)

func TestUnitUserAuthRefreshApi(t *testing.T) {
	ctx := t.Context()
	api := &userapiauthrefresh.Api{
		Req: userapiauthrefresh.Req{
			RefreshToken: "jti-123.secret-abc",
		},
		Resp: userapiauthrefresh.Resp{
			UserAccessToken:       "eyJhbGciOi...",
			UserRefreshToken:      "jti-123.secret-new",
			UserId:                "u-12345",
			ExpiresAt:             1792900000,
			RefreshTokenExpiresAt: 1795492000,
		},
	}

	apiCopy := jsonz.MustCopy(api, &userapiauthrefresh.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "user-auth-refresh", parsed.Spec.Id)
}
