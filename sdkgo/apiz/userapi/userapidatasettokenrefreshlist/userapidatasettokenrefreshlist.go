package userapidatasettokenrefreshlist

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

type RefreshTokenSummary struct {
	Jti        string            `json:"jti"`
	Dataset    lakedsz.Dataset   `json:"dataset"`
	Solution   solution.Solution `json:"solution"`
	Grants     uint8             `json:"grants"`
	Labels     map[string]string `json:"labels,omitempty"`
	CreatedBy  string            `json:"created_by"`
	CreatedAt  int64             `json:"created_at"`
	LastUsedAt int64             `json:"last_used_at"`
	ExpiresAt  int64             `json:"expires_at"`
	Revoked    bool              `json:"revoked"`
	Annotation string            `json:"annotation,omitempty"`
}

type Req struct {
	Dataset    lakedsz.Dataset `json:"dataset"`
	AuthHeader string          `json:"authorization"`
}

type Resp struct {
	Tokens []RefreshTokenSummary `json:"tokens"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-dataset-token-refresh-list",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "List Dataset Refresh Tokens",
				Summary: "Lists all active machine refresh tokens provisioned for a dataset.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "GET",
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
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "List of refresh token summaries."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"tokens": {
						Desc: &schemaz.Desc{Summary: "List of refresh token records."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]RefreshTokenSummary, RefreshTokenSummary]{
							Slice: func() *[]RefreshTokenSummary { return &d.Resp.Tokens },
							Get: func(idx int, element *RefreshTokenSummary) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"jti": {
												Desc:  &schemaz.Desc{Summary: "Token JTI."},
												Field: func() any { return &element.Jti },
											},
											"dataset": {
												Desc:  &schemaz.Desc{Summary: "Target dataset ID."},
												Field: func() any { return &element.Dataset },
											},
											"solution": {
												Desc:  &schemaz.Desc{Summary: "Solution domain restriction."},
												Field: func() any { return &element.Solution },
											},
											"grants": {
												Desc:  &schemaz.Desc{Summary: "Grants bitmask."},
												Field: func() any { return &element.Grants },
											},
											"labels": {
												Desc:  &schemaz.Desc{Summary: "Metadata labels."},
												Field: func() any { return &element.Labels },
											},
											"created_by": {
												Desc:  &schemaz.Desc{Summary: "User ID who created the token."},
												Field: func() any { return &element.CreatedBy },
											},
											"created_at": {
												Desc:  &schemaz.Desc{Summary: "Creation timestamp in millis."},
												Field: func() any { return &element.CreatedAt },
											},
											"last_used_at": {
												Desc:  &schemaz.Desc{Summary: "Epoch milliseconds when token was last refreshed (0 = never used)."},
												Field: func() any { return &element.LastUsedAt },
											},
											"expires_at": {
												Desc:  &schemaz.Desc{Summary: "Expiration timestamp in millis."},
												Field: func() any { return &element.ExpiresAt },
											},
											"revoked": {
												Desc:  &schemaz.Desc{Summary: "Revocation status flag."},
												Field: func() any { return &element.Revoked },
											},
											"annotation": {
												Desc:  &schemaz.Desc{Summary: "Description note."},
												Field: func() any { return &element.Annotation },
											},
										}
									},
								}
							},
						}),
					},
				}
			},
		},
	}
}
