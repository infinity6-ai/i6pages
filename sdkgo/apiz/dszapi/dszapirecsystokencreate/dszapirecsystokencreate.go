package dszapirecsystokencreate

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dsztoken"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type DszCreateRecsysTokenReq struct {
	Dataset    lakedsz.Dataset `json:"dataset"`
	Annotation string          `json:"annotation"`
	Channel    string          `json:"channel"`
}

type Api struct {
	Req  DszCreateRecsysTokenReq `json:"req"`
	Resp dsztoken.DatasetToken   `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-create-recsys-token",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Create Recsys Token",
				Summary: "Creates a read/recommendation token for the recommendation system associated with a specific dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/ds/dataset/{dataset}/recsystoken/create",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset to create the recommendation system token for."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Request payload for creating a recommendation system token."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"annotation": {
						Desc:  &schemaz.Desc{Summary: "Optional note or annotation identifying the purpose of this token."},
						Field: func() any { return &d.Req.Annotation },
					},
					"channel": {
						Desc:  &schemaz.Desc{Summary: "Sales/distribution channel this recommendation token is restricted to (e.g. retail)."},
						Field: func() any { return &d.Req.Channel },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody:    d.Resp.Schema(),
	}
}
