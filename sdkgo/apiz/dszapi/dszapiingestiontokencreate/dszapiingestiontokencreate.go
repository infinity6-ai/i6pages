package dszapiingestiontokencreate

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dsztoken"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type DszCreateIngestionTokenReq struct {
	Dataset    lakedsz.Dataset `json:"dataset"`
	Annotation string          `json:"annotation"`
}

type Api struct {
	Req  DszCreateIngestionTokenReq `json:"req"`
	Resp dsztoken.DatasetToken      `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-create-ingestion-token",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Create Ingestion Token",
				Summary: "Creates a write token for data ingestion into a specific dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/ds/dataset/{dataset}/ingestiontoken/create",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset to create the ingestion token for."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Ingestion token configuration request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"annotation": {
						Desc:  &schemaz.Desc{Summary: "Optional note or annotation identifying the purpose of this token."},
						Field: func() any { return &d.Req.Annotation },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody:    d.Resp.Schema(),
	}
}
