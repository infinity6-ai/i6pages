package userapiauthpasswordreset

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	Email string `json:"email"`
}

type Resp struct {
	Status string `json:"status"` // "password_reset_email_sent"
	Email  string `json:"email"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-auth-password-reset",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Password Reset Email Dispatch",
				Summary: "Dispatches an out-of-band password reset email via Identity Platform.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/auth/password/reset",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Password reset request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"email": {
						Desc:  &schemaz.Desc{Summary: "Account email address to send password reset."},
						Field: func() any { return &d.Req.Email },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Password reset dispatch response."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"status": {
						Desc:  &schemaz.Desc{Summary: "Password reset dispatch status."},
						Field: func() any { return &d.Resp.Status },
					},
					"email": {
						Desc:  &schemaz.Desc{Summary: "Email address where reset was sent."},
						Field: func() any { return &d.Resp.Email },
					},
				}
			},
		},
	}
}
