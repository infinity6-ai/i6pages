package dszapistoredisplaylist_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapistoredisplaylist"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dszstore"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storedisplayid"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
)

func TestUnitDszStoreDisplayListApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapistoredisplaylist.Api{
		Req: &dszapistoredisplaylist.DszStoreDisplayListReq{
			Dataset: lakedsz.MustParse("myds"),
			StoreId: storeid.MustParse("store1"),
		},
		Resp: &dszapistoredisplaylist.DszStoreDisplayListResp{
			Dataset: lakedsz.MustParse("myds"),
			StoreId: storeid.MustParse("store1"),
			Displays: []dszstore.DszStoreDisplay{
				{
					Id:   storedisplayid.MustParse("display1"),
					Name: "Display One",
				},
			},
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapistoredisplaylist.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-store-display-list", parsed.Spec.Id)
}
