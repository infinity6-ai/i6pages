package userapiauthme_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthme"
)

func TestUnitUserAuthMeApi(t *testing.T) {
	ctx := t.Context()
	api := &userapiauthme.Api{
		Req: userapiauthme.Req{
			AuthHeader: "Bearer eyJhbGci...",
		},
		Resp: userapiauthme.Resp{
			UserId:        "u-12345",
			EmailRedacted: "al***@infinity6.ai",
			Providers:     []string{"google"},
			CreatedAt:     1792900000,
		},
	}

	apiCopy := jsonz.MustCopy(api, &userapiauthme.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "user-auth-me", parsed.Spec.Id)
}
