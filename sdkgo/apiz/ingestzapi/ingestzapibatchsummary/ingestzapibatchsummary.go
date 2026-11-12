package ingestzapibatchsummary

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbnamez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type Req struct {
	Dataset lakedsz.Dataset       `json:"dataset"`
	Table   laketbnamez.TableName `json:"table"`
	StoreId storeid.StoreId       `json:"store_id"`
}

type Resp struct {
	StoreId         storeid.StoreId  `json:"store_id"`
	RowCount        int              `json:"row_count"`
	IngestedAt      string           `json:"ingested_at"`
	ColumnSummaries []*ColumnSummary `json:"column_summaries"`
}

type ColumnSummary struct {
	ColumnName    string `json:"column_name"`
	DistinctCount int    `json:"distinct_count"`
	NullCount     int    `json:"null_count"`
}

type Api struct {
	Req  *Req  `json:"req"`
	Resp *Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "ingestz-last-batch-summary",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Last Successful Ingestion Data Summary",
				Summary: "Returns the date of ingestion, rows count and distinct and null columns count",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ingest/dataset/{dataset}/last-batch",
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
					d.Req = &Req{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Name of the dataset that receives the uploaded files."},
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
					d.Req = &Req{}
				}
				return map[string]*schemaz.Schema{
					"table": {
						Desc:     &schemaz.Desc{Summary: "Name of the table inside the dataset."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Table, laketbnamez.MustParse),
					},
					"store_id": {
						Desc:     &schemaz.Desc{Summary: "Store ID associated with the ingestion."},
						UrlValue: schemaz.ParseStrGet(&d.Req.StoreId, storeid.MustParse),
					},
				}
			},
		},
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Name: "Get Last Successful Ingestion Data Summary Response", Summary: "Returns the date of ingestion, rows count and distinct and null columns count"},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &Resp{}
				}
				return map[string]*schemaz.Schema{
					"store_id": {
						Desc:  &schemaz.Desc{Summary: "Store ID associated with the ingestion."},
						Field: func() any { return &d.Resp.StoreId },
					},
					"row_count": {
						Desc:  &schemaz.Desc{Summary: "Total number of successfully ingested rows."},
						Field: func() any { return &d.Resp.RowCount },
					},
					"ingested_at": {
						Desc:  &schemaz.Desc{Summary: "Timestamp when the batch was successfully ingested."},
						Field: func() any { return &d.Resp.IngestedAt },
					},
					"column_summaries": {
						Desc: &schemaz.Desc{Summary: "Summaries of distinct and null counts per column."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]*ColumnSummary, *ColumnSummary]{
							Slice:      func() *[]*ColumnSummary { return &d.Resp.ColumnSummaries },
							NewElement: func(idx int) *ColumnSummary { return &ColumnSummary{} },
							Get: func(idx int, element **ColumnSummary) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"column_name": {
												Desc:  &schemaz.Desc{Summary: "Name of the column."},
												Field: func() any { return &(*element).ColumnName },
											},
											"distinct_count": {
												Desc:  &schemaz.Desc{Summary: "Number of distinct values in the column."},
												Field: func() any { return &(*element).DistinctCount },
											},
											"null_count": {
												Desc:  &schemaz.Desc{Summary: "Number of null values in the column."},
												Field: func() any { return &(*element).NullCount },
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
