package dszapidatasetsolutions_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapidatasetsolutions"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitDszListActiveSolutionsApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapidatasetsolutions.Api{
		Req: &dszapidatasetsolutions.DszListActiveSolutionsReq{
			Dataset: lakedsz.MustParse("myds"),
		},
		Resp: &dszapidatasetsolutions.DszListActiveSolutionsResp{
			Dataset: lakedsz.MustParse("myds"),
			Solutions: []solution.Solution{
				solution.Relevance().Solution,
				solution.Plat().Solution,
			},
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapidatasetsolutions.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-dataset-solutions", parsed.Spec.Id)
}
