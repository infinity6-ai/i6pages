package dszapipaymentautorenewupdate_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapipaymentautorenewupdate"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitDszPaymentAutoRenewUpdateApi(t *testing.T) {
	ctx := t.Context()

	t.Run("round trip", func(t *testing.T) {
		api := &dszapipaymentautorenewupdate.Api{
			Req: &dszapipaymentautorenewupdate.Req{
				Dataset:   lakedsz.MustParse("myds"),
				Solution:  solution.Relevance().Solution,
				AutoRenew: true,
			},
		}
		apiCopy := jsonz.MustCopy(api, &dszapipaymentautorenewupdate.Api{})
		require.Equal(t, api.Req, apiCopy.Req)
	})

	t.Run("body schema has auto_renew", func(t *testing.T) {
		api := &dszapipaymentautorenewupdate.Api{
			Req: &dszapipaymentautorenewupdate.Req{
				Dataset:   lakedsz.MustParse("myds"),
				Solution:  solution.Relevance().Solution,
				AutoRenew: false,
			},
		}
		body := string(jsonz.MustFormat(api.ApiDataRefs().ReqBody).Bytes())
		require.JSONEq(t, `{"auto_renew": false}`, body)
	})

	t.Run("spec", func(t *testing.T) {
		parsed := jsparserapi.ParseApi(ctx, &dszapipaymentautorenewupdate.Api{})
		require.NotNil(t, parsed)
		require.Equal(t, "dsz-update-payment-auto-renew", parsed.Spec.Id)
		require.Equal(t, "POST", parsed.Spec.Method)
		require.Equal(t, "/api/ds/dataset/{dataset}/solution/{solution}/payment/autorenew", parsed.Spec.Path)
	})
}
