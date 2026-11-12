package dszapiingestiontokencreate_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapiingestiontokencreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dsztoken"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
)

func TestUnitDszCreateIngestionTokenApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapiingestiontokencreate.Api{
		Req: dszapiingestiontokencreate.DszCreateIngestionTokenReq{
			Dataset:    lakedsz.MustParse("myds"),
			Annotation: "Annotation",
		},
		Resp: dsztoken.DatasetToken{
			Id:             "token1",
			Jti:            "jti1",
			Dataset:        lakedsz.MustParse("myds"),
			Annotation:     "Annotation",
			ExpirationDate: 12345678,
			Audience:       "aud",
			Grants:         []string{"write"},
			Token:          "tok-1",
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapiingestiontokencreate.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-create-ingestion-token", parsed.Spec.Id)
}
