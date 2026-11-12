package userapiauthexchange_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthexchange"
)

func TestUnitUserAuthExchangeApi(t *testing.T) {
	ctx := t.Context()
	api := &userapiauthexchange.Api{
		Req: userapiauthexchange.Req{
			Code:         "code-123",
			CodeVerifier: "verifier-456",
			Ext:          "state-789",
		},
		Resp: userapiauthexchange.Resp{
			UserAccessToken:  "jwt-token-abc",
			UserRefreshToken: "rt-token-def",
			UserId:           "u-1234",
			ExpiresAt:        1792933262,
		},
	}

	apiCopy := jsonz.MustCopy(api, &userapiauthexchange.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "user-auth-exchange", parsed.Spec.Id)
}
