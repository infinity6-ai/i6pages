package dszapistorecreate

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dszstore"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type DszCreateStoreReq struct {
	Dataset lakedsz.Dataset
	Store   dszstore.DszStore
}

type Api struct {
	Req *DszCreateStoreReq
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-create-store",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Create Store",
				Summary: "Creates a store configuration under a specific dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/ds/dataset/{dataset}/store/create",
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
					d.Req = &DszCreateStoreReq{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset containing the store config to create."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Request body containing store configuration parameters."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &DszCreateStoreReq{}
				}
				return map[string]*schemaz.Schema{
					"store": d.Req.Store.Schema(),
				}
			},
		},
		RespHeaders: nil,
		RespBody:    nil,
	}
}
