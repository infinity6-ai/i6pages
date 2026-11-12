package userapidatasettokenaccessattenuate

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

type Req struct {
	Subsolution solution.Solution `json:"subsolution,omitempty"`
	Subgrants   uint8             `json:"subgrants,omitempty"`
	Newlabels   map[string]string `json:"newlabels,omitempty"`
	ExpSeconds  int64             `json:"exp_seconds,omitempty"`
	AuthHeader  string            `json:"authorization"`
}

type Resp struct {
	AccessToken string            `json:"access_token"`
	Dataset     lakedsz.Dataset   `json:"dataset"`
	Solution    solution.Solution `json:"solution"`
	Grants      uint8             `json:"grants"`
	Labels      map[string]string `json:"labels,omitempty"`
	ExpiresAt   int64             `json:"expires_at"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-dataset-token-access-attenuate",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Attenuate Dataset Access Token",
				Summary: "Derives an in-flight attenuated child access token with dropped privileges from an active access token.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/attenuate",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"authorization": {
						Desc:     &schemaz.Desc{Summary: "Parent Bearer dataset access token."},
						UrlValue: schemaz.ParseStr(&d.Req.AuthHeader),
					},
				}
			},
		},
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "In-flight access token attenuation request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"subsolution": {
						Desc:  &schemaz.Desc{Summary: "Narrowed solution domain."},
						Field: func() any { return &d.Req.Subsolution },
					},
					"subgrants": {
						Desc:  &schemaz.Desc{Summary: "Reduced uint8 grant bitmask."},
						Field: func() any { return &d.Req.Subgrants },
					},
					"newlabels": {
						Desc:  &schemaz.Desc{Summary: "Additional restrictive label constraints."},
						Field: func() any { return &d.Req.Newlabels },
					},
					"exp_seconds": {
						Desc:  &schemaz.Desc{Summary: "Requested lifetime in seconds (capped at parent exp)."},
						Field: func() any { return &d.Req.ExpSeconds },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Attenuated access token response."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"access_token": {
						Desc:  &schemaz.Desc{Summary: "Attenuated Base64URL dataset access token."},
						Field: func() any { return &d.Resp.AccessToken },
					},
					"dataset": {
						Desc:  &schemaz.Desc{Summary: "Target dataset ID."},
						Field: func() any { return &d.Resp.Dataset },
					},
					"solution": {
						Desc:  &schemaz.Desc{Summary: "Effective solution domain."},
						Field: func() any { return &d.Resp.Solution },
					},
					"grants": {
						Desc:  &schemaz.Desc{Summary: "Effective uint8 grant bitmask."},
						Field: func() any { return &d.Resp.Grants },
					},
					"labels": {
						Desc:  &schemaz.Desc{Summary: "Effective metadata labels."},
						Field: func() any { return &d.Resp.Labels },
					},
					"expires_at": {
						Desc:  &schemaz.Desc{Summary: "Expiration epoch milliseconds."},
						Field: func() any { return &d.Resp.ExpiresAt },
					},
				}
			},
		},
	}
}
