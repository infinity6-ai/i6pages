package relevancefashiondashimpactedmetricsbyshowcasecategory

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
	ShowcaseCategory *string
	Recomendations   float64
	Clicks           float64
	CartAdds         float64
	Purchases        float64
	Revenue          float64
	Participation    float64
	ConversionRate   float64
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
		Id:      "product-relevance-fashion-dash-impacted-metrics-by-showcase-category",
		Version: "v1",
		Typ:     sdkfuncz.TypClientQuery,
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Metrics by Category",
				Summary: "Gets the metrics impacted by recommendations by showcase category for a store and period.",
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
											"showcase_category": {
												Desc:  &schemaz.Desc{Summary: "Showcase category."},
												Field: func() any { return &(*element).ShowcaseCategory },
											},
											"recomendations": {
												Desc:  &schemaz.Desc{Summary: "Number of recommendations."},
												Field: func() any { return &(*element).Recomendations },
											},
											"clicks": {
												Desc:  &schemaz.Desc{Summary: "Number of clicks."},
												Field: func() any { return &(*element).Clicks },
											},
											"cart_adds": {
												Desc:  &schemaz.Desc{Summary: "Number of cart adds."},
												Field: func() any { return &(*element).CartAdds },
											},
											"purchases": {
												Desc:  &schemaz.Desc{Summary: "Number of purchases."},
												Field: func() any { return &(*element).Purchases },
											},
											"revenue": {
												Desc:  &schemaz.Desc{Summary: "Revenue."},
												Field: func() any { return &(*element).Revenue },
											},
											"participation": {
												Desc:  &schemaz.Desc{Summary: "Participation share."},
												Field: func() any { return &(*element).Participation },
											},
											"conversion_rate": {
												Desc:  &schemaz.Desc{Summary: "Conversion rate."},
												Field: func() any { return &(*element).ConversionRate },
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
