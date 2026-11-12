package dszapirecsystokenslist

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dsztoken"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type DszListRecsysTokensReq struct {
	Dataset lakedsz.Dataset `json:"dataset"`
}

type DszListRecsysTokensResp struct {
	Tokens []dsztoken.DatasetToken `json:"tokens"`
}

type Api struct {
	Req  DszListRecsysTokensReq  `json:"req"`
	Resp DszListRecsysTokensResp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-list-recsys-tokens",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "List Recsys Tokens",
				Summary: "Lists all active recommendation system tokens for a specific dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ds/dataset/{dataset}/recsystoken/list",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset whose recommendation system tokens should be listed."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response containing the list of recommendation system tokens."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"tokens": {
						Desc: &schemaz.Desc{Summary: "List of recommendation system tokens configured for this dataset."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]dsztoken.DatasetToken, dsztoken.DatasetToken]{
							Slice: func() *[]dsztoken.DatasetToken { return &d.Resp.Tokens },
							Get: func(idx int, element *dsztoken.DatasetToken) *schemaz.Schema {
								return element.Schema()
							},
						}),
					},
				}
			},
		},
	}
}
