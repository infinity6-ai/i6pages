package dszapistoredisplaylist

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dszstore"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type DszStoreDisplayListReq struct {
	Dataset lakedsz.Dataset `json:"dataset"`
	StoreId storeid.StoreId `json:"store_id"`
}

type DszStoreDisplayListResp struct {
	Dataset  lakedsz.Dataset            `json:"dataset"`
	StoreId  storeid.StoreId            `json:"store_id"`
	Displays []dszstore.DszStoreDisplay `json:"displays"`
}

type Api struct {
	Req  *DszStoreDisplayListReq  `json:"req"`
	Resp *DszStoreDisplayListResp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-store-display-list",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "List Store Displays",
				Summary: "Lists all active store displays configured for a store under a specific dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ds/dataset/{dataset}/store/display/list",
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
					d.Req = &DszStoreDisplayListReq{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset containing the store displays to list."},
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
					d.Req = &DszStoreDisplayListReq{}
				}
				return map[string]*schemaz.Schema{
					// An empty store_id stays unset, the service answers it with a bad request
					"store_id": {
						Desc: &schemaz.Desc{Summary: "Store identifier whose displays should be listed."},
						UrlValue: schemaz.ParseStrGet(&d.Req.StoreId, func(v string) storeid.StoreId {
							if v == "" {
								return storeid.StoreId{}
							}
							return storeid.MustParse(v)
						}),
					},
				}
			},
		},
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response with the list of store displays."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &DszStoreDisplayListResp{}
				}
				if d.Resp.Displays == nil {
					d.Resp.Displays = []dszstore.DszStoreDisplay{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:  &schemaz.Desc{Summary: "Dataset identifier."},
						Field: func() any { return &d.Resp.Dataset },
					},
					"store_id": {
						Desc:  &schemaz.Desc{Summary: "Store identifier."},
						Field: func() any { return &d.Resp.StoreId },
					},
					"displays": {
						Desc: &schemaz.Desc{Summary: "List of store display configurations."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]dszstore.DszStoreDisplay, dszstore.DszStoreDisplay]{
							Slice: func() *[]dszstore.DszStoreDisplay { return &d.Resp.Displays },
							Get: func(idx int, element *dszstore.DszStoreDisplay) *schemaz.Schema {
								return &schemaz.Schema{
									Desc: &schemaz.Desc{Summary: "Store display configuration details."},
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"id": {
												Desc:  &schemaz.Desc{Summary: "Unique identifier of the store display."},
												Field: func() any { return &element.Id },
											},
											"name": {
												Desc:  &schemaz.Desc{Summary: "Human-readable name of the store display."},
												Field: func() any { return &element.Name },
											},
										}
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
