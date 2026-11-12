package userapiauthpasswordsignup

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	Email         string `json:"email"`
	Password      string `json:"password"`
	CodeChallenge string `json:"code_challenge,omitempty"`
	App           string `json:"app,omitempty"`
}

type Resp struct {
	Status string `json:"status"` // "verification_email_sent"
	Email  string `json:"email"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-auth-password-signup",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Email and Password Sign-Up",
				Summary: "Registers a new user with Identity Platform and dispatches a verification email.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/auth/signup/password",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Email and password registration request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"email": {
						Desc:  &schemaz.Desc{Summary: "User email address to register."},
						Field: func() any { return &d.Req.Email },
					},
					"password": {
						Desc:  &schemaz.Desc{Summary: "Password for the new account."},
						Field: func() any { return &d.Req.Password },
					},
					"code_challenge": {
						Desc:  &schemaz.Desc{Summary: "Optional PKCE code challenge."},
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
			Desc: &schemaz.Desc{Summary: "Signup response indicating verification status."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"status": {
						Desc:  &schemaz.Desc{Summary: "Signup workflow status (e.g. 'verification_email_sent')."},
						Field: func() any { return &d.Resp.Status },
					},
					"email": {
						Desc:  &schemaz.Desc{Summary: "Registered email address."},
						Field: func() any { return &d.Resp.Email },
					},
				}
			},
		},
	}
}
