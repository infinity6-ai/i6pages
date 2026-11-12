package dszapisubscriptionplanupdate

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type Req struct {
	Dataset  lakedsz.Dataset
	Solution solution.Solution
	Plan     string
}

type Api struct {
	Req *Req
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-update-subscription-plan",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Update Subscription Plan",
				Summary: "Updates the plan (price) of the Stripe subscription for a dataset product/solution.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/ds/dataset/{dataset}/solution/{solution}/subscription/plan",
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
						Desc:     &schemaz.Desc{Summary: "Dataset of the subscription"},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
					"solution": {
						Desc:     &schemaz.Desc{Summary: "Solution (product) of the subscription"},
						UrlValue: schemaz.ParseStrGet(&d.Req.Solution, solution.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Subscription plan update parameters"},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &Req{}
				}
				return map[string]*schemaz.Schema{
					"plan": {
						Desc:  &schemaz.Desc{Summary: "Lookup key of the new Stripe price"},
						Field: func() any { return &d.Req.Plan },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody:    nil,
	}
}
