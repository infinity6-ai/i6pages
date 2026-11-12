package dszapipaymentlist_test

import (
	"testing"
	"time"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapipaymentlist"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitDszListPaymentsApi(t *testing.T) {
	ctx := t.Context()
	created := time.Date(2026, 10, 27, 0, 0, 0, 0, time.UTC)
	periodEnd := time.Date(2026, 11, 27, 0, 0, 0, 0, time.UTC)
	payment := dszapipaymentlist.Payment{
		Id: "in_1", Number: "ABC-0001", Status: "paid", Currency: "brl", AmountDue: 9900, AmountPaid: 9900,
		Created: created, PeriodStart: created, PeriodEnd: periodEnd,
		InvoicePdfUrl: "https://pay.stripe.com/invoice/1/pdf",
		ReceiptPdfUrl: "https://pay.stripe.com/receipt/1/pdf",
		Lines: []dszapipaymentlist.PaymentLine{
			{
				Id:          "il_1",
				Solution:    solution.Relevance().Solution,
				Amount:      9900,
				Description: "1 x i6 Relevance",
			},
		},
	}

	t.Run("round trip", func(t *testing.T) {
		api := &dszapipaymentlist.Api{
			Req:  &dszapipaymentlist.Req{Dataset: lakedsz.MustParse("myds")},
			Resp: &dszapipaymentlist.Resp{Payments: []dszapipaymentlist.Payment{payment}},
		}
		apiCopy := jsonz.MustCopy(api, &dszapipaymentlist.Api{})
		require.Equal(t, api.Req, apiCopy.Req)
		require.Equal(t, api.Resp, apiCopy.Resp)
	})

	t.Run("body has the payments and an empty list without payments", func(t *testing.T) {
		body := func(resp *dszapipaymentlist.Resp) string {
			api := &dszapipaymentlist.Api{Resp: resp}
			return string(jsonz.MustFormat(api.ApiDataRefs().RespBody).Bytes())
		}
		require.JSONEq(t, `{"payments":[{
			"id":"in_1","number":"ABC-0001","status":"paid","currency":"brl","amount_due":9900,"amount_paid":9900,
			"created":"2026-10-27T00:00:00Z","period_start":"2026-10-27T00:00:00Z","period_end":"2026-11-27T00:00:00Z",
			"invoice_pdf_url":"https://pay.stripe.com/invoice/1/pdf",
			"receipt_pdf_url":"https://pay.stripe.com/receipt/1/pdf",
			"lines":[{
				"id":"il_1",
				"solution":"relevance",
				"amount":9900,
				"description":"1 x i6 Relevance"
			}]}]}`,
			body(&dszapipaymentlist.Resp{Payments: []dszapipaymentlist.Payment{payment}}))
		require.JSONEq(t, `{"payments":[]}`, body(&dszapipaymentlist.Resp{}))
	})

	t.Run("spec", func(t *testing.T) {
		parsed := jsparserapi.ParseApi(ctx, &dszapipaymentlist.Api{})
		require.NotNil(t, parsed)
		require.Equal(t, "dsz-list-payments", parsed.Spec.Id)
		require.Equal(t, "GET", parsed.Spec.Method)
		require.Equal(t, "/api/ds/dataset/{dataset}/payments", parsed.Spec.Path)
	})
}
