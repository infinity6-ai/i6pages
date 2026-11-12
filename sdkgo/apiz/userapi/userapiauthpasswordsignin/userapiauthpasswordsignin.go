package userapiauthpasswordsignin

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	Email         string `json:"email"`
	Password      string `json:"password"`
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
		Id: "user-auth-password-signin",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Email and Password Sign-In",
				Summary: "Authenticates an email and password against Identity Platform, enforcing confirmed emails and minting a PKCE code.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/auth/signin/password",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Email and password sign-in request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"email": {
						Desc:  &schemaz.Desc{Summary: "User email address."},
						Field: func() any { return &d.Req.Email },
					},
					"password": {
						Desc:  &schemaz.Desc{Summary: "User account password."},
						Field: func() any { return &d.Req.Password },
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
