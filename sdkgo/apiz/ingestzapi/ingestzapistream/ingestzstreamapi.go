package ingestzapistream

import (
	"reflect"

	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"

	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/tabledataz"
	"go.code.infinity6.ai/sdkgo/sdkgo/tabledataz/relevancefashiondataz"
)

func AllApis() []apiz.Api {
	return []apiz.Api{
		&Api[*relevancefashiondataz.Catalog]{},
		&Api[*relevancefashiondataz.Event]{},
	}
}

type StreamReq[T tabledataz.TableData] struct {
	Dataset lakedsz.Dataset
	Data    []T
}

type StreamResp struct {
	Count int
}

type Api[T tabledataz.TableData] struct {
	Req  StreamReq[T]
	Resp StreamResp
}

func (d *Api[T]) ApiSpec() apiz.ApiSpec {
	var x T
	return apiz.ApiSpec{
		Id: "ingestz-stream-" + x.Table().String(),
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Stream Ingestion",
				Summary: "Ingests stream data into a target dataset table.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/ingest/dataset/{dataset}/stream/" + x.Table().String(),
	}
}

func (d *Api[T]) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Name of the dataset that receives the stream data."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"data": {
						Desc: &schemaz.Desc{Summary: "Generic stream data to ingest."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]T, T]{
							Slice: func() *[]T { return &d.Req.Data },
							NewElement: func(idx int) T {
								typ := reflect.TypeFor[T]()
								if typ.Kind() == reflect.Pointer {
									return reflect.New(typ.Elem()).Interface().(T)
								}
								var x T
								return x
							},
							Get: func(idx int, element *T) *schemaz.Schema {
								return (*element).SchemaQuery()
							},
						}),
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"count": {
						Desc:  &schemaz.Desc{Summary: "Number of ingested events."},
						Field: func() any { return &d.Resp.Count },
					},
				}
			},
		},
	}
}
