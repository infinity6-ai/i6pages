package platformresultz

import (
	"context"
	"fmt"

	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/urlz"
	"github.com/infinity6-ai/gox/fsz/fszjson"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbnamez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbpathz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
)

type BatchSummaryReq struct {
	Table   laketbnamez.TableName `json:"table"`
	StoreId storeid.StoreId       `json:"store_id"`
}

type BatchSummaryData struct {
	StoreId         string           `json:"store_id" bigquery:"store_id"`
	RowCount        int              `json:"row_count,string" bigquery:"row_count"`
	IngestedAt      string           `json:"ingested_at" bigquery:"ingested_at"`
	ColumnSummaries []*ColumnSummary `json:"column_summaries" bigquery:"column_summaries"`
}

type ColumnSummary struct {
	ColumnName    string `json:"column_name" bigquery:"column_name"`
	DistinctCount int    `json:"distinct_count,string" bigquery:"distinct_count"`
	NullCount     int    `json:"null_count,string" bigquery:"null_count"`
}

type BatchSummary struct {
	Req  *BatchSummaryReq  `json:"req"`
	Resp *BatchSummaryData `json:"resp"`
}

func (c *BatchSummary) Download(ctx context.Context, u *urlz.Url) bool {
	found, _, err := fszjson.Download(ctx, func(item *BatchSummaryData) (bool, error) {
		c.Resp = item
		return false, nil
	}, fszjson.DownloadOptions{Url: u, Gzip: true})
	errorz.Check(err)
	return found
}

func (c *BatchSummary) ResultName() string {
	return "last-batch-summary"
}

func (c *BatchSummary) QuerySchema() *schemaz.Schema {
	return &schemaz.Schema{
		Object: func(read bool) map[string]*schemaz.Schema {
			if read && c.Req == nil {
				return nil
			}
			if c.Req == nil {
				c.Req = &BatchSummaryReq{}
			}

			return map[string]*schemaz.Schema{
				"store_id": {
					Desc:     &schemaz.Desc{Summary: "Store ID to query."},
					UrlValue: schemaz.ParseStrGet(&c.Req.StoreId, storeid.MustParse),
				},
				"table": {
					Desc:     &schemaz.Desc{Summary: "Table of the batch in question."},
					UrlValue: schemaz.ParseStrGet(&c.Req.Table, laketbnamez.MustParse),
				},
			}
		},
	}
}

func (c *BatchSummary) Path() laketbpathz.Path {
	return laketbpathz.MustParse(fmt.Sprintf("i6tb://results.%s-last-batch/store_id=%s/part.json.gz", c.Req.Table, c.Req.StoreId))
}

func (c *BatchSummary) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{Summary: "Summary of the batch data loaded into the store datalake."},
		Object: func(read bool) map[string]*schemaz.Schema {
			if read && c.Resp == nil {
				return nil
			}
			if c.Resp == nil {
				c.Resp = &BatchSummaryData{}
			}

			return map[string]*schemaz.Schema{
				"store_id": {
					Desc:  &schemaz.Desc{Summary: "Store identifier."},
					Field: func() any { return &c.Resp.StoreId },
				},
				"ingested_at": {
					Desc:  &schemaz.Desc{Summary: "Batch ingestion date."},
					Field: func() any { return &c.Resp.IngestedAt },
				},
				"row_count": {
					Desc:  &schemaz.Desc{Summary: "Number of rows in the batch."},
					Field: func() any { return &c.Resp.RowCount },
				},
				"column_summaries": {
					Desc: &schemaz.Desc{Summary: "Summaries of distinct and null counts per column."},
					Array: schemaz.NewArray(schemaz.ArrayOptions[[]*ColumnSummary, *ColumnSummary]{
						Slice:      func() *[]*ColumnSummary { return &c.Resp.ColumnSummaries },
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
	}

}
