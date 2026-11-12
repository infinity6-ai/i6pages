package userapidatasettokenrefreshcreate

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

type Req struct {
	Dataset    lakedsz.Dataset   `json:"dataset"`
	Solution   solution.Solution `json:"solution"`
	Grants     uint8             `json:"grants,omitempty"` // Optional: If omitted or 0, defaults to caller's registered grants on the dataset. Limited to registered grants.
	Labels     map[string]string `json:"labels,omitempty"`
	ExpSeconds int64             `json:"exp_seconds,omitempty"`
	Annotation string            `json:"annotation,omitempty"`
	AuthHeader string            `json:"authorization"`
}

type Resp struct {
	Jti        string            `json:"jti"`
	Dataset    lakedsz.Dataset   `json:"dataset"`
	PrivKey    string            `json:"priv_key"` // Base64URL-encoded Ed25519 private key (returned once only)
	Solution   solution.Solution `json:"solution"`
	Grants     uint8             `json:"grants"`
	Labels     map[string]string `json:"labels,omitempty"`
	ExpiresAt  int64             `json:"expires_at"`
	Annotation string            `json:"annotation,omitempty"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-dataset-token-refresh-create",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Create Dataset Refresh Token",
				Summary: "Provisions a long-lived machine dataset refresh token with an Ed25519 keypair.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/dataset-refresh-token/{dataset}",
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
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Dataset refresh token creation request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"solution": {
						Desc:  &schemaz.Desc{Summary: "Solution domain restriction (empty for all)."},
						Field: func() any { return &d.Req.Solution },
					},
					"grants": {
						Desc:  &schemaz.Desc{Summary: "Compact uint8 grant bitmask (optional, defaults to caller's registered grants on dataset; limited to registered grants)."},
						Field: func() any { return &d.Req.Grants },
					},
					"labels": {
						Desc:  &schemaz.Desc{Summary: "Contextual metadata labels."},
						Field: func() any { return &d.Req.Labels },
					},
					"exp_seconds": {
						Desc:  &schemaz.Desc{Summary: "Lifetime in seconds (optional, defaults to 100 years)."},
						Field: func() any { return &d.Req.ExpSeconds },
					},
					"annotation": {
						Desc:  &schemaz.Desc{Summary: "Human-friendly purpose note."},
						Field: func() any { return &d.Req.Annotation },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Created dataset refresh token response containing private key."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"jti": {
						Desc:  &schemaz.Desc{Summary: "Credential JTI (Base64URL Ed25519 public key)."},
						Field: func() any { return &d.Resp.Jti },
					},
					"dataset": {
						Desc:  &schemaz.Desc{Summary: "Target dataset ID."},
						Field: func() any { return &d.Resp.Dataset },
					},
					"priv_key": {
						Desc:  &schemaz.Desc{Summary: "Base64URL Ed25519 private key (returned once only)."},
						Field: func() any { return &d.Resp.PrivKey },
					},
					"solution": {
						Desc:  &schemaz.Desc{Summary: "Solution domain restriction."},
						Field: func() any { return &d.Resp.Solution },
					},
					"grants": {
						Desc:  &schemaz.Desc{Summary: "Effective uint8 grant bitmask."},
						Field: func() any { return &d.Resp.Grants },
					},
					"labels": {
						Desc:  &schemaz.Desc{Summary: "Contextual metadata labels."},
						Field: func() any { return &d.Resp.Labels },
					},
					"expires_at": {
						Desc:  &schemaz.Desc{Summary: "Expiration epoch milliseconds."},
						Field: func() any { return &d.Resp.ExpiresAt },
					},
					"annotation": {
						Desc:  &schemaz.Desc{Summary: "Human-friendly purpose note."},
						Field: func() any { return &d.Resp.Annotation },
					},
				}
			},
		},
	}
}
