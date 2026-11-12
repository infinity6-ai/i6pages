package userapidatasettokenrefresh

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
	"go.code.infinity6.ai/sdkgo/sdkgo/grants"
)

type Req struct {
	Signature   string            `json:"x-i6-signature"` // 121-byte RefreshAssertion
	Dataset     lakedsz.Dataset   `json:"dataset"`
	Subsolution solution.Solution `json:"subsolution,omitempty"`
	Subgrants   grants.Grant      `json:"subgrants,omitempty"`
	Newlabels   map[string]string `json:"newlabels,omitempty"`
	ExpSeconds  int64             `json:"exp_seconds,omitempty"`
}

type Resp struct {
	AccessToken string            `json:"access_token"`
	Dataset     lakedsz.Dataset   `json:"dataset"`
	Solution    solution.Solution `json:"solution"`
	Grants      grants.Grant      `json:"grants"`
	Labels      map[string]string `json:"labels,omitempty"`
	ExpiresAt   int64             `json:"expires_at"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-dataset-token-refresh",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Refresh Dataset Access Token",
				Summary: "Refreshes and attenuates a dataset access token using an Ed25519 signature assertion.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/refresh-dataset",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"x_i6_signature": {
						Desc:     &schemaz.Desc{Summary: "Standalone 121-byte RefreshAssertion Ed25519 signature."},
						UrlValue: schemaz.ParseStr(&d.Req.Signature),
					},
				}
			},
		},
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Token refresh and downward attenuation request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:  &schemaz.Desc{Summary: "Target dataset ID."},
						Field: func() any { return &d.Req.Dataset },
					},
					"subsolution": {
						Desc:  &schemaz.Desc{Summary: "Optional sub-solution restriction."},
						Field: func() any { return &d.Req.Subsolution },
					},
					"subgrants": {
						Desc:  &schemaz.Desc{Summary: "Optional reduced grant bitmask."},
						Field: func() any { return &d.Req.Subgrants },
					},
					"newlabels": {
						Desc:  &schemaz.Desc{Summary: "Additional restrictive label constraints."},
						Field: func() any { return &d.Req.Newlabels },
					},
					"exp_seconds": {
						Desc:  &schemaz.Desc{Summary: "Requested lifetime in seconds."},
						Field: func() any { return &d.Req.ExpSeconds },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Refreshed access token response."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"access_token": {
						Desc:  &schemaz.Desc{Summary: "Binary-packed Base64URL dataset access token."},
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
