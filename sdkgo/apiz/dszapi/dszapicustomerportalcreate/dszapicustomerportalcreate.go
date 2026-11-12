package dszapicustomerportalcreate

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type Req struct {
	Dataset   lakedsz.Dataset
	ReturnUrl string
	Locale    string
}

type Resp struct {
	Url string
}

type Api struct {
	Req  *Req
	Resp *Resp
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-create-customer-portal",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Create Customer Portal",
				Summary: "Creates a Stripe billing portal session URL where the user can manage cards, auto-renew, and plans.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/ds/dataset/{dataset}/portal",
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
						Desc:     &schemaz.Desc{Summary: "Dataset of the customer"},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Customer portal parameters"},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &Req{}
				}
				return map[string]*schemaz.Schema{
					"return_url": {
						Desc:  &schemaz.Desc{Summary: "URL where the user is redirected when leaving the portal"},
						Field: func() any { return &d.Req.ReturnUrl },
					},
					"locale": {
						Desc:  &schemaz.Desc{Summary: "Locale for the portal interface, defaults to en-US if empty (e.g. pt-BR, en-US)"},
						Field: func() any { return &d.Req.Locale },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Customer portal session response"},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &Resp{}
				}
				return map[string]*schemaz.Schema{
					"url": {
						Desc:  &schemaz.Desc{Summary: "URL of the Stripe customer portal session"},
						Field: func() any { return &d.Resp.Url },
					},
				}
			},
		},
	}
}
