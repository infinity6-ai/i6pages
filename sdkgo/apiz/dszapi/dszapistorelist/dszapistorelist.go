package dszapistorelist

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dszstore"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type DszListStoresReq struct {
	Dataset lakedsz.Dataset `json:"dataset"`
}

type DszListStoresResp struct {
	Dataset lakedsz.Dataset     `json:"dataset"`
	Stores  []dszstore.DszStore `json:"stores"`
}

type Api struct {
	Req  *DszListStoresReq  `json:"req"`
	Resp *DszListStoresResp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-list-stores",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "List Stores",
				Summary: "Lists all stores configured under a specific dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ds/dataset/{dataset}/store/list",
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
					d.Req = &DszListStoresReq{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset to list stores from."},
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
			Desc: &schemaz.Desc{Summary: "Response containing the listed stores."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &DszListStoresResp{}
				}
				if d.Resp.Stores == nil {
					d.Resp.Stores = []dszstore.DszStore{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:  &schemaz.Desc{Summary: "Dataset identifier."},
						Field: func() any { return &d.Resp.Dataset },
					},
					"stores": {
						Desc: &schemaz.Desc{Summary: "List of store configurations."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]dszstore.DszStore, dszstore.DszStore]{
							Slice: func() *[]dszstore.DszStore { return &d.Resp.Stores },
							Get: func(idx int, element *dszstore.DszStore) *schemaz.Schema {
								return element.Schema()
							},
						}),
					},
				}
			},
		},
	}
}
