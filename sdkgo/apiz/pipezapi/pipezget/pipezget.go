package pipezget

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/pipez"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type PipezGetReq struct {
	Dataset lakedsz.Dataset `json:"dataset"`
	Id      string          `json:"id"`
}

type PipezGetResp struct {
	Pipeline *pipez.Pipeline `json:"pipeline"`
}

func (*PipezGetResp) JSType() string {
	return jstypez.TypObject
}

type Api struct {
	Req  *PipezGetReq  `json:"req"`
	Resp *PipezGetResp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "pipez-get",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Pipeline",
				Summary: "Gets a pipeline of a dataset by its id.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/pipe/dataset/{dataset}/id/{id}",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &PipezGetReq{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset identifier."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
					"id": {
						Desc:     &schemaz.Desc{Summary: "Pipeline id."},
						UrlValue: schemaz.ParseStr(&d.Req.Id),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response containing the pipeline."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &PipezGetResp{}
				}
				return map[string]*schemaz.Schema{
					"pipeline": {
						Desc: &schemaz.Desc{Summary: "Pipeline and its states."},
						Object: func(read bool) map[string]*schemaz.Schema {
							if read && d.Resp.Pipeline == nil {
								return nil
							}
							if d.Resp.Pipeline == nil {
								d.Resp.Pipeline = &pipez.Pipeline{}
							}
							return d.Resp.Pipeline.Schema().Object(read)
						},
					},
				}
			},
		},
	}
}
