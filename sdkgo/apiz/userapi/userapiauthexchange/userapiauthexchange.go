package userapiauthexchange

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	Code         string `json:"code"`
	CodeVerifier string `json:"code_verifier"`
	Ext          string `json:"ext,omitempty"`
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
		Id: "user-auth-exchange",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "PKCE Authorization Code Exchange",
				Summary: "Exchanges a PKCE authorization code and verifier for user access and refresh tokens.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/auth/exchange",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Authorization code exchange request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"code": {
						Desc:  &schemaz.Desc{Summary: "Short-lived authorization code."},
						Field: func() any { return &d.Req.Code },
					},
					"code_verifier": {
						Desc:  &schemaz.Desc{Summary: "RFC 7636 PKCE S256 code verifier."},
						Field: func() any { return &d.Req.CodeVerifier },
					},
					"ext": {
						Desc:  &schemaz.Desc{Summary: "Encrypted client state / session metadata."},
						Field: func() any { return &d.Req.Ext },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Authorization code exchange response containing user tokens."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"user_access_token": {
						Desc:  &schemaz.Desc{Summary: "Signed user access token JWT."},
						Field: func() any { return &d.Resp.UserAccessToken },
					},
					"user_refresh_token": {
						Desc:  &schemaz.Desc{Summary: "Opaque user refresh token."},
						Field: func() any { return &d.Resp.UserRefreshToken },
					},
					"user_id": {
						Desc:  &schemaz.Desc{Summary: "Authenticated user UUID."},
						Field: func() any { return &d.Resp.UserId },
					},
					"expires_at": {
						Desc:  &schemaz.Desc{Summary: "Access token expiration epoch millis."},
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
