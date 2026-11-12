package dszapisubscriptionplanupdate_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapisubscriptionplanupdate"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitDszSubscriptionPlanUpdateApi(t *testing.T) {
	ctx := t.Context()

	t.Run("round trip", func(t *testing.T) {
		api := &dszapisubscriptionplanupdate.Api{
			Req: &dszapisubscriptionplanupdate.Req{
				Dataset:  lakedsz.MustParse("myds"),
				Solution: solution.Relevance().Solution,
				Plan:     "relevance_growth_base_monthly",
			},
		}
		apiCopy := jsonz.MustCopy(api, &dszapisubscriptionplanupdate.Api{})
		require.Equal(t, api.Req, apiCopy.Req)
	})

	t.Run("body schema has plan", func(t *testing.T) {
		api := &dszapisubscriptionplanupdate.Api{
			Req: &dszapisubscriptionplanupdate.Req{
				Dataset:  lakedsz.MustParse("myds"),
				Solution: solution.Relevance().Solution,
				Plan:     "relevance_growth_base_monthly",
			},
		}
		body := string(jsonz.MustFormat(api.ApiDataRefs().ReqBody).Bytes())
		require.JSONEq(t, `{"plan": "relevance_growth_base_monthly"}`, body)
	})

	t.Run("spec", func(t *testing.T) {
		parsed := jsparserapi.ParseApi(ctx, &dszapisubscriptionplanupdate.Api{})
		require.NotNil(t, parsed)
		require.Equal(t, "dsz-update-subscription-plan", parsed.Spec.Id)
		require.Equal(t, "POST", parsed.Spec.Method)
		require.Equal(t, "/api/ds/dataset/{dataset}/solution/{solution}/subscription/plan", parsed.Spec.Path)
	})
}
