package dszapistoredisplaycreate_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapistoredisplaycreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dszstore"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storedisplayid"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
)

func TestUnitDszStoreDisplayCreateApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapistoredisplaycreate.Api{
		Req: &dszapistoredisplaycreate.DszStoreDisplayCreateReq{
			Dataset: lakedsz.MustParse("myds"),
			StoreId: storeid.MustParse("store1"),
			Display: dszstore.DszStoreDisplay{
				Id:   storedisplayid.MustParse("display1"),
				Name: "Display One",
			},
		},
		Resp: &dszapistoredisplaycreate.DszStoreDisplayCreateResp{
			Display: dszstore.DszStoreDisplay{
				Id:   storedisplayid.MustParse("display1"),
				Name: "Display One",
			},
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapistoredisplaycreate.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-store-display-create", parsed.Spec.Id)
}
