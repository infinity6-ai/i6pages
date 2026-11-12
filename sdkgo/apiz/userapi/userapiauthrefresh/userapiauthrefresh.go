package userapiauthrefresh

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	RefreshToken string `json:"refresh_token"`
}

type Resp struct {
	UserAccessToken       string `json:"user_access_token"`
	UserRefreshToken      string `json:"user_refresh_token"`
	UserId                string `json:"user_id"`
	ExpiresAt             int64  `json:"expires_at"`
	RefreshTokenExpiresAt int64  `json:"refresh_token_expires_at"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-auth-refresh",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Human User Session Refresh",
				Summary: "Exchanges a human user refresh token for fresh access and rotated refresh tokens.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/refresh-user",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "User refresh token payload."},
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
			Desc: &schemaz.Desc{Summary: "Session refresh response containing fresh access and rotated refresh tokens."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"user_access_token": {
						Desc:  &schemaz.Desc{Summary: "Fresh signed user access token JWT."},
						Field: func() any { return &d.Resp.UserAccessToken },
					},
					"user_refresh_token": {
						Desc:  &schemaz.Desc{Summary: "Rotated opaque user refresh token with new secret."},
						Field: func() any { return &d.Resp.UserRefreshToken },
					},
					"user_id": {
						Desc:  &schemaz.Desc{Summary: "Authenticated user UUID."},
						Field: func() any { return &d.Resp.UserId },
					},
					"expires_at": {
						Desc:  &schemaz.Desc{Summary: "Access token expiration epoch millis (1 hour)."},
						Field: func() any { return &d.Resp.ExpiresAt },
					},
					"refresh_token_expires_at": {
						Desc:  &schemaz.Desc{Summary: "User refresh token expiration epoch millis (30 days)."},
						Field: func() any { return &d.Resp.RefreshTokenExpiresAt },
					},
				}
			},
		},
	}
}
