package ingestzapibatchsummary_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/ingestzapi/ingestzapibatchsummary"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbnamez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
)

func TestUnitIngestzBatchSummaryApi(t *testing.T) {
	api := &ingestzapibatchsummary.Api{
		Req: &ingestzapibatchsummary.Req{
			Dataset: lakedsz.MustParse("my-dataset"),
			Table:   laketbnamez.MustParse("my-table"),
			StoreId: storeid.MustParse("store-123"),
		},
		Resp: &ingestzapibatchsummary.Resp{
			StoreId:    storeid.MustParse("store-123"),
			RowCount:   5000,
			IngestedAt: "2026-10-16T12:00:00Z",
			ColumnSummaries: []*ingestzapibatchsummary.ColumnSummary{
				{
					ColumnName:    "id",
					DistinctCount: 5000,
					NullCount:     0,
				},
				{
					ColumnName:    "category",
					DistinctCount: 12,
					NullCount:     15,
				},
			},
		},
	}

	api2 := jsonz.MustCopy(api, &ingestzapibatchsummary.Api{})

	require.Equal(t, api.Req.Dataset, api2.Req.Dataset)
	require.Equal(t, api.Req.Table, api2.Req.Table)
	require.Equal(t, api.Req.StoreId, api2.Req.StoreId)

	require.NotNil(t, api2.Resp)
	require.Equal(t, api.Resp.StoreId, api2.Resp.StoreId)
	require.Equal(t, api.Resp.RowCount, api2.Resp.RowCount)
	require.Equal(t, api.Resp.IngestedAt, api2.Resp.IngestedAt)

	require.Equal(t, len(api.Resp.ColumnSummaries), len(api2.Resp.ColumnSummaries))
	require.Equal(t, api.Resp.ColumnSummaries[0].ColumnName, api2.Resp.ColumnSummaries[0].ColumnName)
	require.Equal(t, api.Resp.ColumnSummaries[0].DistinctCount, api2.Resp.ColumnSummaries[0].DistinctCount)
	require.Equal(t, api.Resp.ColumnSummaries[0].NullCount, api2.Resp.ColumnSummaries[0].NullCount)

	require.Equal(t, api.Resp.ColumnSummaries[1].ColumnName, api2.Resp.ColumnSummaries[1].ColumnName)
	require.Equal(t, api.Resp.ColumnSummaries[1].DistinctCount, api2.Resp.ColumnSummaries[1].DistinctCount)
	require.Equal(t, api.Resp.ColumnSummaries[1].NullCount, api2.Resp.ColumnSummaries[1].NullCount)
}
