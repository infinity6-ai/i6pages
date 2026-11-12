package relevancefashiondashfunnel

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
	EventType string
	FromRec   string
	QtEvents  string
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
		Id:      "product-relevance-fashion-dash-funnel",
		Version: "v1",
		Typ:     sdkfuncz.TypClientQuery,
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Funnel",
				Summary: "Gets the event counts of the recommendation funnel for a store and period.",
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
											"event_type": {
												Desc:  &schemaz.Desc{Summary: "Event type."},
												Field: func() any { return &(*element).EventType },
											},
											"from_rec": {
												Desc:  &schemaz.Desc{Summary: "Whether the event came from a recommendation."},
												Field: func() any { return &(*element).FromRec },
											},
											"qt_events": {
												Desc:  &schemaz.Desc{Summary: "Number of events."},
												Field: func() any { return &(*element).QtEvents },
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
