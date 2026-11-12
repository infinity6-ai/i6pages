package dszapitableget_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapitableget"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbpathz"
)

func TestUnitDszApiTableGet(t *testing.T) {
	api := &dszapitableget.Api{
		Req: dszapitableget.Req{
			Dataset: lakedsz.MustParse("myds"),
			Path:    laketbpathz.MustParse("i6tb://mydb.mytable/part-1"),
		},
		Resp: dszapitableget.Resp{
			Location: "https://example.com/part-1",
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapitableget.Api{})

	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)
	require.Equal(t, "https://example.com/part-1", apiCopy.Resp.Location)
}

func TestUnitDszApiTableGetParseApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapitableget.Api{}
	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-table-get", parsed.Spec.Id)
}
