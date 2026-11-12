package relevancefashiondashcoverage

import (
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
)

type Params struct {
	MinYearMonth string
	MaxYearMonth string
}

type Partitions struct {
	StoreId string
}

type Row struct {
	RecomendationCoverage float64
	RecommendedItems      float64
	RecommendableItems    float64
	LongTailCoverage      float64
	Top1Coverage          float64
	Top1To5Coverage       float64
	Top5To10Coverage      float64
	Bottom90Coverage      float64
}

type Result struct {
	Rows []*Row
}

type Req struct {
	Dataset        lakedsz.Dataset
	DashPartitions Partitions
	Params         Params
}

type Resp struct {
	Results Result
}

type Func struct {
	Req  Req
	Resp Resp
}

func (d *Func) SdkFuncSpec() sdkfuncz.Spec {
	return sdkfuncz.Spec{
		Id:      "product-relevance-fashion-dash-coverage",
		Version: "v1",
		Typ:     sdkfuncz.TypClientQuery,
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Coverage",
				Summary: "Gets the recommendation coverage of the catalog for a store and period.",
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
					"params": {
						Desc: &schemaz.Desc{Summary: "Query params."},
						Object: func(_ bool) map[string]*schemaz.Schema {
							return map[string]*schemaz.Schema{
								"min_year_month": {
									Desc:  &schemaz.Desc{Summary: "First year-month of the period."},
									Field: func() any { return &d.Req.Params.MinYearMonth },
								},
								"max_year_month": {
									Desc:  &schemaz.Desc{Summary: "Last year-month of the period."},
									Field: func() any { return &d.Req.Params.MaxYearMonth },
								},
							}
						},
					},
				}
			},
		},
		Partitions: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"store_id": {
						Desc:  &schemaz.Desc{Summary: "Store identifier."},
						Field: func() any { return &d.Req.DashPartitions.StoreId },
					},
				}
			},
		},
		Output: &schemaz.Schema{
			Object: func(_ bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"rows": {
						Desc: &schemaz.Desc{Summary: "Result rows."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]*Row, *Row]{
							Slice:      func() *[]*Row { return &d.Resp.Results.Rows },
							NewElement: func(idx int) *Row { return &Row{} },
							Get: func(idx int, element **Row) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"recomendation_coverage": {
												Desc:  &schemaz.Desc{Summary: "Share of recommendable items that were recommended."},
												Field: func() any { return &(*element).RecomendationCoverage },
											},
											"recommended_items": {
												Desc:  &schemaz.Desc{Summary: "Number of distinct items recommended."},
												Field: func() any { return &(*element).RecommendedItems },
											},
											"recommendable_items": {
												Desc:  &schemaz.Desc{Summary: "Number of items eligible to be recommended."},
												Field: func() any { return &(*element).RecommendableItems },
											},
											"long_tail_coverage": {
												Desc:  &schemaz.Desc{Summary: "Coverage of the long tail items."},
												Field: func() any { return &(*element).LongTailCoverage },
											},
											"top_1_coverage": {
												Desc:  &schemaz.Desc{Summary: "Coverage of the top 1% items."},
												Field: func() any { return &(*element).Top1Coverage },
											},
											"top_1_to_5_coverage": {
												Desc:  &schemaz.Desc{Summary: "Coverage of the items between top 1% and top 5%."},
												Field: func() any { return &(*element).Top1To5Coverage },
											},
											"top_5_to_10_coverage": {
												Desc:  &schemaz.Desc{Summary: "Coverage of the items between top 5% and top 10%."},
												Field: func() any { return &(*element).Top5To10Coverage },
											},
											"bottom_90_coverage": {
												Desc:  &schemaz.Desc{Summary: "Coverage of the bottom 90% items."},
												Field: func() any { return &(*element).Bottom90Coverage },
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
