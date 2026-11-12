package dszapistoredisplaycreate

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dszstore"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type DszStoreDisplayCreateReq struct {
	Dataset lakedsz.Dataset          `json:"dataset"`
	StoreId storeid.StoreId          `json:"store_id"`
	Display dszstore.DszStoreDisplay `json:"display"`
}

type DszStoreDisplayCreateResp struct {
	Display dszstore.DszStoreDisplay `json:"display"`
}

type Api struct {
	Req  *DszStoreDisplayCreateReq  `json:"req"`
	Resp *DszStoreDisplayCreateResp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-store-display-create",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Create Store Display",
				Summary: "Creates a store display configuration mapping for a store under a specific dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/ds/dataset/{dataset}/store/display/create",
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
					d.Req = &DszStoreDisplayCreateReq{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset containing the store."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &DszStoreDisplayCreateReq{}
				}
				return map[string]*schemaz.Schema{
					"store_id": {
						Desc:  &schemaz.Desc{Summary: "Unique identifier of the store."},
						Field: func() any { return &d.Req.StoreId },
					},
					"display": {
						Desc: &schemaz.Desc{Summary: "Store display configuration details."},
						Object: func(read bool) map[string]*schemaz.Schema {
							return map[string]*schemaz.Schema{
								"id": {
									Desc:  &schemaz.Desc{Summary: "Unique identifier of the store display."},
									Field: func() any { return &d.Req.Display.Id },
								},
								"name": {
									Desc:  &schemaz.Desc{Summary: "Human-readable name of the store display."},
									Field: func() any { return &d.Req.Display.Name },
								},
								"model_name": {
									Desc:  &schemaz.Desc{Summary: "Name of the recommendation/relevance model associated with this display."},
									Field: func() any { return &d.Req.Display.ModelName },
								},
							}
						},
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response body confirming the created store display configuration."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &DszStoreDisplayCreateResp{}
				}
				return map[string]*schemaz.Schema{
					"display": {
						Desc: &schemaz.Desc{Summary: "Created store display configuration details."},
						Object: func(read bool) map[string]*schemaz.Schema {
							return map[string]*schemaz.Schema{
								"id": {
									Desc:  &schemaz.Desc{Summary: "Unique identifier of the store display."},
									Field: func() any { return &d.Resp.Display.Id },
								},
								"name": {
									Desc:  &schemaz.Desc{Summary: "Human-readable name of the store display."},
									Field: func() any { return &d.Resp.Display.Name },
								},
							}
						},
					},
				}
			},
		},
	}
}
