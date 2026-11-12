package pipezstart

import (
	"reflect"

	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"

	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/pipez"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/pipez/relevancefashionpipez"
)

func AllApis() []apiz.Api {
	return []apiz.Api{
		&Api[*relevancefashionpipez.BatchIngest]{},
		&Api[*relevancefashionpipez.Main]{},
	}
}

type PipezStartReq[T pipez.Pipe] struct {
	Dataset lakedsz.Dataset `json:"dataset"`
	Params  T               `json:"params"`
}

type PipezStartResp struct {
	Id string `json:"id"`
}

func (*PipezStartResp) JSType() string {
	return jstypez.TypObject
}

type Api[T pipez.Pipe] struct {
	Req  *PipezStartReq[T] `json:"req"`
	Resp *PipezStartResp   `json:"resp"`
}

func newT[T any]() T {
	typ := reflect.TypeFor[T]()
	if typ.Kind() == reflect.Pointer {
		return reflect.New(typ.Elem()).Interface().(T)
	}
	var x T
	return x
}

func (d *Api[T]) ApiSpec() apiz.ApiSpec {
	p := newT[T]()
	return apiz.ApiSpec{
		Id: "pipez-start-" + p.SolutionDomain().String() + "-" + p.Pipename(),
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Start Pipeline",
				Summary: "Starts a pipeline on a dataset with the given params and returns its id.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/pipe/dataset/{dataset}/start/" + p.SolutionDomain().String() + "/" + p.Pipename(),
	}
}

func (d *Api[T]) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &PipezStartReq[T]{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset identifier."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Pipeline params."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &PipezStartReq[T]{}
				}

				d.Req.Params = newT[T]()
				schema := d.Req.Params.Schema()
				if schema == nil {
					return map[string]*schemaz.Schema{}
				}
				return map[string]*schemaz.Schema{
					"params": schema,
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response containing the started pipeline."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &PipezStartResp{}
				}
				return map[string]*schemaz.Schema{
					"id": {
						Desc:  &schemaz.Desc{Summary: "Pipeline id."},
						Field: func() any { return &d.Resp.Id },
					},
				}
			},
		},
	}
}
