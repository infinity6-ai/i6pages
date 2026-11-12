package dszapitokendelete

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type DszDeleteTokenReq struct {
	Dataset lakedsz.Dataset `json:"dataset"`
	Token   string          `json:"token"`
}

type Api struct {
	Req DszDeleteTokenReq `json:"req"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-delete-token",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Delete Token",
				Summary: "Deletes (revokes) a specific token (e.g. ingestion or recsys token) associated with a dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "DELETE",
		Path:   "/api/ds/dataset/{dataset}/token/delete",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "The dataset whose token should be deleted."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"token": {
						Desc:     &schemaz.Desc{Summary: "The token identifier (jti) to be deleted/revoked."},
						UrlValue: schemaz.ParseStr(&d.Req.Token),
					},
				}
			},
		},
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody:    nil,
	}
}
