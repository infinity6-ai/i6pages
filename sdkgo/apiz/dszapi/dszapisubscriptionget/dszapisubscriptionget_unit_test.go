package dszapisubscriptionget_test

import (
	"testing"
	"time"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapisubscriptionget"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitDszGetSubscriptionApi(t *testing.T) {
	ctx := t.Context()
	periodEnd := time.Date(2026, 11, 27, 0, 0, 0, 0, time.UTC)
	cancelAt := time.Date(2026, 12, 27, 0, 0, 0, 0, time.UTC)

	t.Run("round trip with cancel_at", func(t *testing.T) {
		api := &dszapisubscriptionget.Api{
			Req: &dszapisubscriptionget.Req{Dataset: lakedsz.MustParse("myds"), Solution: solution.Relevance().Solution},
			Resp: &dszapisubscriptionget.Resp{
				PlanKey: "relevance_growth_base_monthly", Status: "past_due", CurrentPeriodEndAt: periodEnd, CancelAt: &cancelAt,
			},
		}
		apiCopy := jsonz.MustCopy(api, &dszapisubscriptionget.Api{})
		require.Equal(t, api.Req, apiCopy.Req)
		require.Equal(t, api.Resp, apiCopy.Resp)
		require.False(t, apiCopy.Resp.Custom())
	})

	t.Run("cancel_at is null without cancellation", func(t *testing.T) {
		api := &dszapisubscriptionget.Api{
			Req:  &dszapisubscriptionget.Req{Dataset: lakedsz.MustParse("myds"), Solution: solution.Relevance().Solution},
			Resp: &dszapisubscriptionget.Resp{PlanKey: "relevance_starter_base_monthly", Status: "active", CurrentPeriodEndAt: periodEnd},
		}
		apiCopy := jsonz.MustCopy(api, &dszapisubscriptionget.Api{})
		require.Nil(t, apiCopy.Resp.CancelAt)
		require.Equal(t, api.Resp, apiCopy.Resp)
	})

	t.Run("body is the subscription itself and {} for custom", func(t *testing.T) {
		body := func(resp *dszapisubscriptionget.Resp) string {
			api := &dszapisubscriptionget.Api{Resp: resp}
			return string(jsonz.MustFormat(api.ApiDataRefs().RespBody).Bytes())
		}
		require.JSONEq(t,
			`{"plan_key":"relevance_growth_base_monthly","status":"past_due","current_period_start_at":"0001-01-01T00:00:00Z","current_period_end_at":"2026-11-27T00:00:00Z","cancel_at":null,"created_at":"0001-01-01T00:00:00Z","cancel_at_period_end":false,"trial_start_at":null,"trial_end_at":null,"next_invoice_at":null}`,
			body(&dszapisubscriptionget.Resp{PlanKey: "relevance_growth_base_monthly", Status: "past_due", CurrentPeriodEndAt: periodEnd}))
		require.JSONEq(t, `{}`, body(&dszapisubscriptionget.Resp{}))
	})

	t.Run("spec", func(t *testing.T) {
		parsed := jsparserapi.ParseApi(ctx, &dszapisubscriptionget.Api{})
		require.NotNil(t, parsed)
		require.Equal(t, "dsz-get-subscription", parsed.Spec.Id)
		require.Equal(t, "/api/ds/dataset/{dataset}/solution/{solution}/subscription", parsed.Spec.Path)
	})
}
