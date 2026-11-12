package userapiauthlogout

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	RefreshToken string `json:"refresh_token"`
}

type Resp struct {
	Success bool `json:"success"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-auth-logout",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Human User Session Logout",
				Summary: "Revokes an active human user session by marking the refresh token and its token family as revoked in userzsession.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/auth/logout",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Logout payload."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"refresh_token": {
						Desc:  &schemaz.Desc{Summary: "Opaque user refresh token in format <jti>.<secret>."},
						Field: func() any { return &d.Req.RefreshToken },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Logout response confirming revocation."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"success": {
						Desc:  &schemaz.Desc{Summary: "Indicates successful session revocation."},
						Field: func() any { return &d.Resp.Success },
					},
				}
			},
		},
	}
}
