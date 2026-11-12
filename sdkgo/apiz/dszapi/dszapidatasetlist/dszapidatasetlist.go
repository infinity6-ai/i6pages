package dszapidatasetlist

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type Solution struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type Dataset struct {
	Id     string   `json:"id"`
	Name   string   `json:"name"`
	Grants []string `json:"grants,omitempty"`
}

type DszListDatasetsReq struct {
	UserId string `json:"userId"`
}

type DszListDatasetsResp struct {
	Datasets []*Dataset `json:"datasets"`
}

type Api struct {
	Req  *DszListDatasetsReq  `json:"req"`
	Resp *DszListDatasetsResp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-list-datasets",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "List Datasets",
				Summary: "Lists all datasets available to the user.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.User,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ds/user-id/{userId}/datasets",
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
					d.Req = &DszListDatasetsReq{}
				}
				return map[string]*schemaz.Schema{
					"userId": {
						Desc:     &schemaz.Desc{Summary: "User identifier (id)."},
						UrlValue: schemaz.ParseStr(&d.Req.UserId),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response containing the list of datasets."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &DszListDatasetsResp{}
				}
				return map[string]*schemaz.Schema{
					"datasets": {
						Desc: &schemaz.Desc{Summary: "List of datasets available to the user."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]*Dataset, *Dataset]{
							Slice:      func() *[]*Dataset { return &d.Resp.Datasets },
							NewElement: func(idx int) *Dataset { return &Dataset{} },
							Get: func(idx int, element **Dataset) *schemaz.Schema {
								return &schemaz.Schema{
									Desc: &schemaz.Desc{Summary: "Dataset object."},
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"id": {
												Desc:  &schemaz.Desc{Summary: "Unique identifier of the dataset."},
												Field: func() any { return &(*element).Id },
											},
											"name": {
												Desc:  &schemaz.Desc{Summary: "Human-readable name of the dataset."},
												Field: func() any { return &(*element).Name },
											},
											"grants": {
												Desc: &schemaz.Desc{Summary: "List of grants or permissions the user has on this dataset."},
												Array: schemaz.NewArray(schemaz.ArrayOptions[[]string, string]{
													Slice: func() *[]string { return &(*element).Grants },
													Get: func(idx int, grant *string) *schemaz.Schema {
														return &schemaz.Schema{
															Desc:  &schemaz.Desc{Summary: "Grant/permission value."},
															Field: func() any { return grant },
														}
													},
												}),
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
