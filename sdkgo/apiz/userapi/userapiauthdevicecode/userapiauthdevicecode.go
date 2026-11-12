package userapiauthdevicecode

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type Req struct {
	App string `json:"app,omitempty"`
}

type Resp struct {
	DeviceCode              string `json:"device_code"`
	UserCode                string `json:"user_code"`
	VerificationUri         string `json:"verification_uri"`
	VerificationUriComplete string `json:"verification_uri_complete"`
	ExpiresInSec            int64  `json:"expires_in_sec"`
	IntervalSec             int    `json:"interval_sec"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "user-auth-device-code",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Device Authorization Code Initiation",
				Summary: "Initiates an RFC 8628 device authorization flow for CLI and remote headless SSH sessions.",
				Labels:  map[string]string{"servname": "userz"},
			}
		},
		Method: "POST",
		Path:   "/api/userz/auth/device/code",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams:  nil,
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Device authorization initiation request."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"app": {
						Desc:  &schemaz.Desc{Summary: "Client application identifier (e.g. i6-cli)."},
						Field: func() any { return &d.Req.App },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Device authorization code response with verification URLs."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"device_code": {
						Desc:  &schemaz.Desc{Summary: "High-entropy secret device code polled by CLI."},
						Field: func() any { return &d.Resp.DeviceCode },
					},
					"user_code": {
						Desc:  &schemaz.Desc{Summary: "Short human-friendly code (e.g. WDJB-MJHT)."},
						Field: func() any { return &d.Resp.UserCode },
					},
					"verification_uri": {
						Desc:  &schemaz.Desc{Summary: "URL where the user completes authorization."},
						Field: func() any { return &d.Resp.VerificationUri },
					},
					"verification_uri_complete": {
						Desc:  &schemaz.Desc{Summary: "Verification URL pre-filled with the user_code."},
						Field: func() any { return &d.Resp.VerificationUriComplete },
					},
					"expires_in_sec": {
						Desc:  &schemaz.Desc{Summary: "Lifetime of the device code in seconds (typically 900)."},
						Field: func() any { return &d.Resp.ExpiresInSec },
					},
					"interval_sec": {
						Desc:  &schemaz.Desc{Summary: "Recommended polling frequency in seconds."},
						Field: func() any { return &d.Resp.IntervalSec },
					},
				}
			},
		},
	}
}
