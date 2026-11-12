package inferzrelevancefashionfbt

import (
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
)

type Sku struct {
	SkuId string
}

type Partitions struct {
	StoreId string
}

type Result struct {
	Skus   []*Sku
	Rating float64
}

type Req struct {
	Dataset         lakedsz.Dataset
	SessionId       string
	UserId          string
	Skus            []*Sku
	ModelPartitions Partitions
}

type Resp struct {
	Results []*Result
}

type Func struct {
	Req  Req
	Resp Resp
}

func (d *Func) SdkFuncSpec() sdkfuncz.Spec {
	return sdkfuncz.Spec{
		Id:      "product-relevance-fashion-fbt",
		Version: "v1",
		Typ:     sdkfuncz.TypClientInfer,
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Bought Together",
				Summary: "Infers the SKUs frequently bought together with the given SKUs for a store.",
			}
		},
	}
}

func (d *Func) SdkFuncDataRefs() *sdkfuncz.DataRefs {
	return &sdkfuncz.DataRefs{
		Input: &schemaz.Schema{
			Object: func(_ bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:  &schemaz.Desc{Summary: "Dataset identifier."},
						Field: func() any { return &d.Req.Dataset },
					},
					"session_id": {
						Desc:  &schemaz.Desc{Summary: "Session identifier."},
						Field: func() any { return &d.Req.SessionId },
					},
					"user_id": {
						Desc:  &schemaz.Desc{Summary: "User identifier."},
						Field: func() any { return &d.Req.UserId },
					},
					"skus": {
						Desc: &schemaz.Desc{Summary: "SKUs to find matches for."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]*Sku, *Sku]{
							Slice:      func() *[]*Sku { return &d.Req.Skus },
							NewElement: func(idx int) *Sku { return &Sku{} },
							Get: func(idx int, element **Sku) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"sku_id": {
												Desc:  &schemaz.Desc{Summary: "SKU identifier."},
												Field: func() any { return &(*element).SkuId },
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
		Partitions: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"store_id": {
						Desc:  &schemaz.Desc{Summary: "Store identifier."},
						Field: func() any { return &d.Req.ModelPartitions.StoreId },
					},
				}
			},
		},
		Output: &schemaz.Schema{
			Object: func(_ bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"results": {
						Desc: &schemaz.Desc{Summary: "Inference results."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]*Result, *Result]{
							Slice:      func() *[]*Result { return &d.Resp.Results },
							NewElement: func(idx int) *Result { return &Result{} },
							Get: func(idx int, element **Result) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"skus": {
												Desc: &schemaz.Desc{Summary: "Matching SKUs."},
												Array: schemaz.NewArray(schemaz.ArrayOptions[[]*Sku, *Sku]{
													Slice:      func() *[]*Sku { return &(*element).Skus },
													NewElement: func(idx int) *Sku { return &Sku{} },
													Get: func(idx int, ele **Sku) *schemaz.Schema {
														return &schemaz.Schema{
															Object: func(_ bool) map[string]*schemaz.Schema {
																return map[string]*schemaz.Schema{
																	"sku_id": {
																		Desc:  &schemaz.Desc{Summary: "SKU identifier."},
																		Field: func() any { return &(*ele).SkuId },
																	},
																}
															},
														}
													},
												}),
											},
											"rating": {
												Desc:  &schemaz.Desc{Summary: "Result rating."},
												Field: func() any { return &(*element).Rating },
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
