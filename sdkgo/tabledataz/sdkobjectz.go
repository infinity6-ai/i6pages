package tabledataz

import (
	"time"

	"cloud.google.com/go/bigquery"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbnamez"
)

type TableData interface {
	SchemaQuery() *schemaz.Schema
	SchemaBody() *schemaz.Schema
	Table() laketbnamez.TableName
	SetDataset(dataset lakedsz.Dataset)
	SetIngestedAt(ingestedAt string)
	Validate() error
	GetCreatedAt() *time.Time
}

func NewBqNullString(val string) bigquery.NullString {
	return bigquery.NullString{
		StringVal: val,
		Valid:     true,
	}
}

func ParseBqNullString(out *bigquery.NullString) func() *schemaz.Parser[string] {
	return func() *schemaz.Parser[string] {
		return &schemaz.Parser[string]{
			Parse: func(v string) {
				*out = bigquery.NullString{
					StringVal: v,
					Valid:     v != "",
				}
			},
			Format: func() (string, any) {
				if !out.Valid {
					return "", *out
				}
				return out.StringVal, *out
			},
		}
	}
}

func ParseTime(out *time.Time) func() *schemaz.Parser[string] {
	return func() *schemaz.Parser[string] {
		return &schemaz.Parser[string]{
			Parse: func(v string) {
				t, err := time.Parse(time.RFC3339, v)
				if err == nil {
					*out = t
				}
			},
			Format: func() (string, any) {
				if out.IsZero() {
					return "", *out
				}
				return out.Format(time.RFC3339), *out
			},
		}
	}
}
