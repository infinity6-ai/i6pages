package dszapiloadresult

import (
	"reflect"

	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"

	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/resultz"
	"go.code.infinity6.ai/sdkgo/sdkgo/resultz/platformresultz"
	"go.code.infinity6.ai/sdkgo/sdkgo/resultz/relevancefashionresultz"
)

func AllApis() []apiz.Api {
	return []apiz.Api{
		&Api[*relevancefashionresultz.CatalogSimple]{},
		&Api[*platformresultz.BatchSummary]{},
	}
}

type Api[T resultz.Result] struct {
	ReqDataset  lakedsz.Dataset
	ReqRespData T
}

func newT[T resultz.Result]() T {
	typ := reflect.TypeFor[T]()
	if typ.Kind() == reflect.Pointer {
		return reflect.New(typ.Elem()).Interface().(T)
	}
	var x T
	return x
}

func isNil(v any) bool {
	if v == nil {
		return true
	}
	val := reflect.ValueOf(v)
	switch val.Kind() {
	case reflect.Chan, reflect.Func, reflect.Map, reflect.Pointer, reflect.Interface, reflect.Slice:
		return val.IsNil()
	default:
		return false
	}
}

func (d *Api[T]) ApiSpec() apiz.ApiSpec {
	var x T
	return apiz.ApiSpec{
		Id: "dsz-result-" + x.ResultName(),
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Load Table File as JSON",
				Summary: "Load a table file from the datalake as JSON and return it.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ds/dataset/{dataset}/results/" + x.ResultName(),
	}
}

func (d *Api[T]) ApiDataRefs() *apiz.DataRefs {
	if isNil(d.ReqRespData) {
		d.ReqRespData = newT[T]()
	}
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Name of the dataset."},
						UrlValue: schemaz.ParseStrGet(&d.ReqDataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: d.ReqRespData.QuerySchema(),
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Loaded result data response payload."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"data": d.ReqRespData.Schema(),
				}
			},
		},
	}
}
