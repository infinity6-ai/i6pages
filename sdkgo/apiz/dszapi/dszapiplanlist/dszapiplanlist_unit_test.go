package dszapiplanlist_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapiplanlist"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitDszListPlansApi(t *testing.T) {
	ctx := t.Context()
	plan := dszapiplanlist.Plan{
		Key: "relevance_growth_monthly_2027", Tier: "growth", Frequency: "monthly", Name: "2027",
		Description: "Growth mensal", Currency: "brl", Amount: 9900, LicAmount: 9900, ReqAmount: 99,
	}

	t.Run("round trip", func(t *testing.T) {
		api := &dszapiplanlist.Api{
			Req:  &dszapiplanlist.Req{Solution: solution.Relevance().Solution},
			Resp: &dszapiplanlist.Resp{Plans: []dszapiplanlist.Plan{plan}},
		}
		apiCopy := jsonz.MustCopy(api, &dszapiplanlist.Api{})
		require.Equal(t, api.Req, apiCopy.Req)
		require.Equal(t, api.Resp, apiCopy.Resp)
	})

	t.Run("body has the plans and an empty list without plans", func(t *testing.T) {
		body := func(resp *dszapiplanlist.Resp) string {
			api := &dszapiplanlist.Api{Resp: resp}
			return string(jsonz.MustFormat(api.ApiDataRefs().RespBody).Bytes())
		}
		require.JSONEq(t, `{"plans":[{
			"key":"relevance_growth_monthly_2027","tier":"growth","frequency":"monthly","name":"2027",
			"description":"Growth mensal","currency":"brl","amount":9900,"lic_amount":9900,"req_amount":99}]}`,
			body(&dszapiplanlist.Resp{Plans: []dszapiplanlist.Plan{plan}}))
		require.JSONEq(t, `{"plans":[]}`, body(&dszapiplanlist.Resp{}))
	})

	t.Run("included requests and decimal request price", func(t *testing.T) {
		body := func(plan dszapiplanlist.Plan) string {
			api := &dszapiplanlist.Api{Resp: &dszapiplanlist.Resp{Plans: []dszapiplanlist.Plan{plan}}}
			return string(jsonz.MustFormat(api.ApiDataRefs().RespBody).Bytes())
		}
		included := int64(500000)

		informed := plan
		informed.IncludedRequests = &included
		informed.ReqAmountDecimal = "0.0294"
		require.Contains(t, body(informed), `"included_requests":500000`)
		require.Contains(t, body(informed), `"req_amount_decimal":"0.0294"`)

		free := plan
		free.ReqAmountDecimal = "0"
		require.Contains(t, body(free), `"req_amount_decimal":"0"`)

		unlimited := plan
		unlimited.IncludedRequestsUnlimited = true
		require.Contains(t, body(unlimited), `"included_requests":null`)

		// not informed: both keys are absent
		require.NotContains(t, body(plan), "included_requests")
		require.NotContains(t, body(plan), "req_amount_decimal")

		api := &dszapiplanlist.Api{Resp: &dszapiplanlist.Resp{Plans: []dszapiplanlist.Plan{informed}}}
		apiCopy := jsonz.MustCopy(api, &dszapiplanlist.Api{})
		require.Equal(t, api.Resp, apiCopy.Resp)
	})

	t.Run("spec", func(t *testing.T) {
		parsed := jsparserapi.ParseApi(ctx, &dszapiplanlist.Api{})
		require.NotNil(t, parsed)
		require.Equal(t, "dsz-list-plans", parsed.Spec.Id)
		require.Equal(t, "GET", parsed.Spec.Method)
		require.Equal(t, "/api/ds/solution/{solution}/plans", parsed.Spec.Path)
	})
}
