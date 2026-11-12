package dszapistorelist_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapistorelist"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dszstore"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
)

func TestUnitDszListStoresApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapistorelist.Api{
		Req: &dszapistorelist.DszListStoresReq{
			Dataset: lakedsz.MustParse("myds"),
		},
		Resp: &dszapistorelist.DszListStoresResp{
			Dataset: lakedsz.MustParse("myds"),
			Stores: []dszstore.DszStore{
				{
					Id:   storeid.MustParse("store1"),
					Name: "Store One",
				},
			},
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapistorelist.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-list-stores", parsed.Spec.Id)
}
