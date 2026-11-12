package dszapipaymentautorenewupdate

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type Req struct {
	Dataset   lakedsz.Dataset
	Solution  solution.Solution
	AutoRenew bool
}

type Api struct {
	Req *Req
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-update-payment-auto-renew",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Update Payment Auto Renew",
				Summary: "Turns auto renew on or off for the Stripe subscription of a dataset product/solution.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/ds/dataset/{dataset}/solution/{solution}/payment/autorenew",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &Req{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset of the payment"},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
					"solution": {
						Desc:     &schemaz.Desc{Summary: "Solution (product) of the payment"},
						UrlValue: schemaz.ParseStrGet(&d.Req.Solution, solution.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Auto renew parameters"},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &Req{}
				}
				return map[string]*schemaz.Schema{
					"auto_renew": {
						Desc:  &schemaz.Desc{Summary: "True to enable auto renew, false to turn it off"},
						Field: func() any { return &d.Req.AutoRenew },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody:    nil,
	}
}
