package pipezlist

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solutiondomain"
	"go.code.infinity6.ai/sdkgo/sdkgo/pipez"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type PipezListReq struct {
	Dataset        lakedsz.Dataset
	SolutionDomain solutiondomain.SolutionDomain
	Name           string
	Status         string
	Cursor         string
	Limit          int
}

type PipezListResp struct {
	Pipelines []*pipez.Pipeline
	Cursor    string
}

func (*PipezListResp) JSType() string {
	return jstypez.TypObject
}

type Api struct {
	Req  *PipezListReq
	Resp *PipezListResp
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "pipez-list",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "List Pipelines",
				Summary: "Lists the pipelines of a dataset, optionally filtered, with cursor pagination.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/pipe/dataset/{dataset}/list",
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
					d.Req = &PipezListReq{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset identifier."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &PipezListReq{}
				}
				return map[string]*schemaz.Schema{
					"solution_domain": {
						Desc:     &schemaz.Desc{Summary: "Filter by solution domain."},
						UrlValue: solutiondomain.ParseStr(&d.Req.SolutionDomain),
					},
					"name": {
						Desc:     &schemaz.Desc{Summary: "Filter by pipeline name."},
						UrlValue: schemaz.ParseStr(&d.Req.Name),
					},
					"status": {
						Desc:     &schemaz.Desc{Summary: "Filter by pipeline status."},
						UrlValue: schemaz.ParseStr(&d.Req.Status),
					},
					"cursor": {
						Desc:     &schemaz.Desc{Summary: "Cursor to fetch the next page."},
						UrlValue: schemaz.ParseStr(&d.Req.Cursor),
					},
					"limit": {
						Desc:     &schemaz.Desc{Summary: "Maximum number of results."},
						UrlValue: schemaz.ParseStrNumber(&d.Req.Limit),
					},
				}
			},
		},
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response containing the listed pipelines."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &PipezListResp{}
				}
				return map[string]*schemaz.Schema{
					"cursor": {
						Desc:  &schemaz.Desc{Summary: "Cursor for the next page."},
						Field: func() any { return &d.Resp.Cursor },
					},
					"pipelines": {
						Desc: &schemaz.Desc{Summary: "List of pipelines."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]*pipez.Pipeline, *pipez.Pipeline]{
							Slice:      func() *[]*pipez.Pipeline { return &d.Resp.Pipelines },
							NewElement: func(idx int) *pipez.Pipeline { return &pipez.Pipeline{} },
							Get: func(idx int, element **pipez.Pipeline) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(read bool) map[string]*schemaz.Schema {
										if read && *element == nil {
											return nil
										}
										if *element == nil {
											*element = &pipez.Pipeline{}
										}
										return (*element).Schema().Object(read)
									},
								}
							},
						}),
					},
				}
			},
		},
	}
}
