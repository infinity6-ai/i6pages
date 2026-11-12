package dszapidatasetlist_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapidatasetlist"
)

func TestUnitDszListDatasetsApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapidatasetlist.Api{
		Req: &dszapidatasetlist.DszListDatasetsReq{
			UserId: "user1",
		},
		Resp: &dszapidatasetlist.DszListDatasetsResp{
			Datasets: []*dszapidatasetlist.Dataset{
				{
					Id:     "myds",
					Name:   "My Dataset",
					Grants: []string{"read"},
				},
			},
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapidatasetlist.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-list-datasets", parsed.Spec.Id)
}
