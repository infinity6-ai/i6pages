package userapiauthme

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	AuthHeader string `json:"authorization"`
}

type Resp struct {
	UserId        string   `json:"user_id"`
	EmailRedacted string   `json:"email_redacted"`
	Providers     []string `json:"providers"`
	CreatedAt     int64    `json:"created_at"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-auth-me",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Current User Profile",
				Summary: "Retrieves current authenticated user identity profile metadata.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "GET",
		Path:   "/api/userz/auth/me",
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
						Desc:     &schemaz.Desc{Summary: "User Bearer JWT access token."},
						UrlValue: schemaz.ParseStr(&d.Req.AuthHeader),
					},
				}
			},
		},
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Current user identity profile."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"user_id": {
						Desc:  &schemaz.Desc{Summary: "User unique identifier."},
						Field: func() any { return &d.Resp.UserId },
					},
					"email_redacted": {
						Desc:  &schemaz.Desc{Summary: "Redacted email address for display."},
						Field: func() any { return &d.Resp.EmailRedacted },
					},
					"providers": {
						Desc: &schemaz.Desc{Summary: "List of linked identity providers."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]string, string]{
							Slice: func() *[]string { return &d.Resp.Providers },
							Get: func(idx int, element *string) *schemaz.Schema {
								return &schemaz.Schema{
									Field: func() any { return element },
								}
							},
						}),
					},
					"created_at": {
						Desc:  &schemaz.Desc{Summary: "Account creation timestamp in epoch milliseconds."},
						Field: func() any { return &d.Resp.CreatedAt },
					},
				}
			},
		},
	}
}
