package userapiauthgoogle

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	IdToken       string `json:"id_token"`
	CodeChallenge string `json:"code_challenge"`
	App           string `json:"app,omitempty"`
}

type Resp struct {
	Code string `json:"code"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-auth-google",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Google Sign-In Credential Exchange",
				Summary: "Verifies a Google OAuth ID token via Identity Platform and mints a single-use PKCE code.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/auth/google",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Google credential sign-in request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"id_token": {
						Desc:  &schemaz.Desc{Summary: "Google OAuth ID token or credential string."},
						Field: func() any { return &d.Req.IdToken },
					},
					"code_challenge": {
						Desc:  &schemaz.Desc{Summary: "RFC 7636 S256 PKCE code challenge."},
						Field: func() any { return &d.Req.CodeChallenge },
					},
					"app": {
						Desc:  &schemaz.Desc{Summary: "Client application identifier."},
						Field: func() any { return &d.Req.App },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Single-use PKCE authorization code response."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"code": {
						Desc:  &schemaz.Desc{Summary: "Single-use PKCE authorization code."},
						Field: func() any { return &d.Resp.Code },
					},
				}
			},
		},
	}
}
