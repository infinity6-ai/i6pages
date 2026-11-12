package dsztoken

import (
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
)

type DatasetToken struct {
	Id             string          `json:"id"`
	Jti            string          `json:"jti"`
	Dataset        lakedsz.Dataset `json:"dataset"`
	Annotation     string          `json:"annotation"`
	ExpirationDate int64           `json:"expiration_date"`
	Audience       string          `json:"audience"`
	Grants         []string        `json:"grants"`
	Channel        string          `json:"channel,omitempty"`
	Token          string          `json:"token,omitempty"`
}

func (d *DatasetToken) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"id": {
					Desc:  &schemaz.Desc{Summary: "Token id."},
					Field: func() any { return &d.Id },
				},
				"jti": {
					Desc:  &schemaz.Desc{Summary: "Token unique id (JWT id)."},
					Field: func() any { return &d.Jti },
				},
				"dataset": {
					Desc:  &schemaz.Desc{Summary: "Dataset identifier."},
					Field: func() any { return &d.Dataset },
				},
				"annotation": {
					Desc:  &schemaz.Desc{Summary: "Note identifying the purpose of the token."},
					Field: func() any { return &d.Annotation },
				},
				"expiration_date": {
					Desc:  &schemaz.Desc{Summary: "Token expiration date."},
					Field: func() any { return &d.ExpirationDate },
				},
				"audience": {
					Desc:  &schemaz.Desc{Summary: "Token audience."},
					Field: func() any { return &d.Audience },
				},
				"grants": {
					Desc: &schemaz.Desc{Summary: "Permissions granted by the token."},
					Array: schemaz.NewArray(schemaz.ArrayOptions[[]string, string]{
						Slice: func() *[]string { return &d.Grants },
						Get: func(idx int, element *string) *schemaz.Schema {
							return &schemaz.Schema{
								Field: func() any { return element },
							}
						},
					}),
				},
				"channel": {
					Desc:  &schemaz.Desc{Summary: "Sales channel the token is restricted to."},
					Field: func() any { return &d.Channel },
				},
				"token": {
					Desc:  &schemaz.Desc{Summary: "Token value."},
					Field: func() any { return &d.Token },
				},
			}
		},
	}
}
