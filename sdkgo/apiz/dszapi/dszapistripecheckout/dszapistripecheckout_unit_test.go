package dszapistripecheckout_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapistripecheckout"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
)

func TestUnitStripeCheckout(t *testing.T) {
	api := &dszapistripecheckout.Api{
		Req: dszapistripecheckout.Req{
			DatasetName:   "my-dataset",
			Plan:          "pro_monthly",
			SuccessUrl:    "https://x/ok",
			CancelUrl:     "https://x/cancel",
			CampaignState: "c3RhdGU",
			PaymentPhone:  "+5511999999999",
			PaymentEmail:  "pay@x.com",
			Document:      "12345678900",
		},
		Resp: dszapistripecheckout.Resp{Id: "cs_1", Url: "https://checkout/cs_1", Dataset: lakedsz.MustParse("dsabcdefghijklmnopq")},
	}

	apiCopy := jsonz.MustCopy(api, &dszapistripecheckout.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)
}

func TestUnitStripeCheckoutParseApi(t *testing.T) {
	ctx := t.Context()
	parsed := jsparserapi.ParseApi(ctx, &dszapistripecheckout.Api{})
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-stripe-checkout", parsed.Spec.Id)
	require.Equal(t, "apiDszStripeCheckout", parsed.Spec.CamelId)
	require.Equal(t, "POST", parsed.Spec.Method)
	require.Equal(t, "/api/stripe/checkout", parsed.Spec.Path)

	tdfMap := make(map[string]*jstypez.Typedef)
	for _, tdf := range parsed.Typedefs.All() {
		tdfMap[tdf.Head.Name] = tdf
	}

	props := func(name string) map[string]jstypez.Tuple {
		tdf, ok := tdfMap[name]
		require.True(t, ok, name)
		ret := make(map[string]jstypez.Tuple)
		for _, p := range tdf.Properties.All() {
			ret[p.Name] = p
		}
		return ret
	}

	req := props("apiDszStripeCheckoutReqPayload")
	for _, name := range []string{"dataset_name", "plan", "success_url", "cancel_url", "campaign_state", "payment_phone", "payment_email", "document"} {
		require.Contains(t, req, name)
	}
	for _, name := range []string{
		"user", "mode", "locale", "allow_promotion_codes", "line_items", "customer_email",
		"subscription_data_trial_period_days", "cnpj_hub", "responsible_name_hub", "responsible_email_hub",
		"id_solution_hub", "id_campanha_hub", "terms_version", "contract_version", "terms_accepted_at",
	} {
		require.NotContains(t, req, name)
	}
	require.Equal(t, "string", req["campaign_state"].Typ)

	resp := props("apiDszStripeCheckoutRespPayload")
	require.Equal(t, "string", resp["id"].Typ)
	require.Equal(t, "string", resp["url"].Typ)
	require.Contains(t, resp, "dataset")
}

func TestUnitStripeCheckoutApiDataRefs(t *testing.T) {
	api := &dszapistripecheckout.Api{}
	refs := api.ApiDataRefs()

	require.Nil(t, refs.PathParams)
	require.Nil(t, refs.QueryParams)
	require.Nil(t, refs.ReqHeaders)
	require.NotNil(t, refs.ReqBody)
	require.Nil(t, refs.RespHeaders)
	require.NotNil(t, refs.RespBody)

	api.Req = dszapistripecheckout.Req{
		Plan:          "pro_monthly",
		SuccessUrl:    "https://x/ok",
		CampaignState: "c3RhdGU",
	}
	body, err := refs.ReqBody.MarshalJSON()
	require.NoError(t, err)
	require.JSONEq(t, `{
		"dataset_name": "",
		"plan": "pro_monthly",
		"success_url": "https://x/ok",
		"cancel_url": "",
		"campaign_state": "c3RhdGU",
		"payment_phone": "",
		"payment_email": "",
		"document": "",
		"user_exchange_callback_url": ""
	}`, string(body))

	// Reading a body fills Req
	other := &dszapistripecheckout.Api{}
	err = other.ApiDataRefs().ReqBody.UnmarshalJSON([]byte(`{"campaign_state":"abc","plan":"p","cancel_url":"https://x/cancel"}`))
	require.NoError(t, err)
	require.Equal(t, "abc", other.Req.CampaignState)
	require.Equal(t, "p", other.Req.Plan)
	require.Equal(t, "https://x/cancel", other.Req.CancelUrl)

	err = other.ApiDataRefs().ReqBody.UnmarshalJSON([]byte(`{"payment_phone":"1","payment_email":"a@b.c","document":"2"}`))
	require.NoError(t, err)
	require.Equal(t, "1", other.Req.PaymentPhone)
	require.Equal(t, "a@b.c", other.Req.PaymentEmail)
	require.Equal(t, "2", other.Req.Document)

	respJSON := []byte(`{"id":"cs_1","url":"https://checkout/cs_1","dataset":"dsabcdefghijklmnopq"}`)
	require.NoError(t, refs.RespBody.UnmarshalJSON(respJSON))
	require.Equal(t, "cs_1", api.Resp.Id)
	require.Equal(t, "https://checkout/cs_1", api.Resp.Url)
	require.Equal(t, "dsabcdefghijklmnopq", api.Resp.Dataset.String())
	out, err := refs.RespBody.MarshalJSON()
	require.NoError(t, err)
	require.JSONEq(t, string(respJSON), string(out))
}
