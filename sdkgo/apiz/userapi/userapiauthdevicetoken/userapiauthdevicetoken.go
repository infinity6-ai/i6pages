package userapiauthdevicetoken

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	DeviceCode string `json:"device_code"`
}

type Resp struct {
	UserAccessToken       string `json:"user_access_token,omitempty"`
	UserRefreshToken      string `json:"user_refresh_token,omitempty"`
	UserId                string `json:"user_id,omitempty"`
	ExpiresAt             int64  `json:"expires_at,omitempty"`
	RefreshTokenExpiresAt int64  `json:"refresh_token_expires_at,omitempty"`
	Status                string `json:"status"` // "pending" | "authorized" | "denied" | "expired"
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-auth-device-token",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Device Token Polling & Exchange",
				Summary: "Polled by CLI clients to check status and exchange an authorized device code for active user tokens.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/auth/device/token",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Device token polling request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"device_code": {
						Desc:  &schemaz.Desc{Summary: "Secret device code returned by /auth/device/code."},
						Field: func() any { return &d.Req.DeviceCode },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Device token polling response or issued credentials."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"user_access_token": {
						Desc:  &schemaz.Desc{Summary: "Signed user access token JWT (when authorized)."},
						Field: func() any { return &d.Resp.UserAccessToken },
					},
					"user_refresh_token": {
						Desc:  &schemaz.Desc{Summary: "Opaque user refresh token session (when authorized)."},
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
					"status": {
						Desc:  &schemaz.Desc{Summary: "Status of the device code: pending | authorized | denied | expired."},
						Field: func() any { return &d.Resp.Status },
					},
				}
			},
		},
	}
}
