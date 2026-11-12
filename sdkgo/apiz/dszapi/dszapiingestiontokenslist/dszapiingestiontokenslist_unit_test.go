package dszapiingestiontokenslist_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapiingestiontokenslist"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dsztoken"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
)

func TestUnitDszListIngestionTokensApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapiingestiontokenslist.Api{
		Req: dszapiingestiontokenslist.DszListIngestionTokensReq{
			Dataset: lakedsz.MustParse("myds"),
		},
		Resp: dszapiingestiontokenslist.DszListIngestionTokensResp{
			Tokens: []dsztoken.DatasetToken{
				{
					Id:             "token1",
					Jti:            "jti1",
					Dataset:        lakedsz.MustParse("myds"),
					Annotation:     "Annotation",
					ExpirationDate: 12345678,
					Audience:       "aud",
					Grants:         []string{"write"},
					Channel:        "chan1",
					Token:          "tok-1",
				},
			},
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapiingestiontokenslist.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-list-ingestion-tokens", parsed.Spec.Id)
}
