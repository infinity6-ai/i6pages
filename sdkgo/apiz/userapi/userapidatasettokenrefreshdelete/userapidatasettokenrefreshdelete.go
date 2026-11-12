package userapidatasettokenrefreshdelete

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
)

type Req struct {
	Dataset    lakedsz.Dataset `json:"dataset"`
	Jti        string          `json:"jti"`
	AuthHeader string          `json:"authorization"`
}

type Api struct {
	Req Req `json:"req"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-dataset-token-refresh-delete",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Revoke Dataset Refresh Token",
				Summary: "Instantly revokes a machine dataset refresh token by JTI.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "DELETE",
		Path:   "/api/userz/dataset-refresh-token/{dataset}/jti/{jti}",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Target dataset ID."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
					"jti": {
						Desc:  &schemaz.Desc{Summary: "Token JTI (public key identifier) to revoke."},
						Field: func() any { return &d.Req.Jti },
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"authorization": {
						Desc:     &schemaz.Desc{Summary: "User Bearer JWT access token."},
						UrlValue: schemaz.ParseStr(&d.Req.AuthHeader),
					},
				}
			},
		},
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody:    nil,
	}
}
