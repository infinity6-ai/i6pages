package dszapitablelist_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/infinity6-ai/gox/fsz/fsz/fszsignmethod"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapitablelist"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbpathz"
)

func TestUnitDszApiTableList(t *testing.T) {
	api := &dszapitablelist.Api{
		Req: dszapitablelist.Req{
			Dataset:    lakedsz.MustParse("myds"),
			Path:       laketbpathz.MustParse("i6tb://mydb.mytable"),
			SignMethod: fszsignmethod.SignMethodGet,
			Recursive:  true,
			Stat:       true,
			FromCursor: "cur-123",
			Limit:      50,
		},
		Resp: dszapitablelist.Resp{
			Files: []*dszapitablelist.File{
				{
					Path:      laketbpathz.MustParse("i6tb://mydb.mytable/part-1"),
					SignedUrl: "https://example.com/part-1",
				},
			},
			NextCursor: "cur-456",
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapitablelist.Api{})

	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)
	require.Equal(t, "cur-123", apiCopy.Req.FromCursor)
	require.Equal(t, "cur-456", apiCopy.Resp.NextCursor)
}

func TestUnitDszApiTableListParseApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapitablelist.Api{}
	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-table-list", parsed.Spec.Id)
}
