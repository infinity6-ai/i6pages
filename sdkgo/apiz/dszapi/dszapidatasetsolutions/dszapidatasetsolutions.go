package dszapidatasetsolutions

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type DszListActiveSolutionsReq struct {
	Dataset lakedsz.Dataset
}

type DszListActiveSolutionsResp struct {
	Dataset   lakedsz.Dataset
	Solutions []solution.Solution
}

type Api struct {
	Req  *DszListActiveSolutionsReq
	Resp *DszListActiveSolutionsResp
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-dataset-solutions",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "List Active Dataset Solutions",
				Summary: "Lists all active solutions configured for a specific dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ds/dataset/{dataset}/solutions",
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
					d.Req = &DszListActiveSolutionsReq{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset identifier to list active solutions for."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response containing active solutions for the dataset."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &DszListActiveSolutionsResp{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:  &schemaz.Desc{Summary: "Dataset identifier."},
						Field: func() any { return &d.Resp.Dataset },
					},
					"solutions": {
						Desc:  &schemaz.Desc{Summary: "Active solutions associated with this dataset."},
						Field: func() any { return &d.Resp.Solutions },
					},
				}
			},
		},
	}
}
