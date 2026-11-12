package relevancefashiondashattachedrevenue_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparser"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashattachedrevenue"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
)

func TestUnitRelevanceFashionDashAttachedRevenue(t *testing.T) {
	fn := &relevancefashiondashattachedrevenue.Func{
		Req: relevancefashiondashattachedrevenue.Req{
			Dataset: lakedsz.MustParse("my-dataset"),
			DashPartitions: relevancefashiondashattachedrevenue.Partitions{
				StoreId: "store-123",
			},
			Params: relevancefashiondashattachedrevenue.Params{
				MinYearMonth: "2024-01",
				MaxYearMonth: "2024-12",
			},
		},
		Resp: relevancefashiondashattachedrevenue.Resp{
			Results: relevancefashiondashattachedrevenue.Result{
				Rows: []*relevancefashiondashattachedrevenue.Row{
					{
						AttachedRevenue:   1500.5,
						AttachedPurchases: 12,
						AttachedSkus:      30,
						AvgTicket:         125.04,
					},
					{
						AttachedRevenue:   10,
						AttachedPurchases: 1,
						AttachedSkus:      2,
						AvgTicket:         10,
					},
				},
			},
		},
	}

	fnCopy := jsonz.MustCopy(fn, &relevancefashiondashattachedrevenue.Func{})

	require.Equal(t, fn.Req, fnCopy.Req)
	require.Equal(t, fn.Resp, fnCopy.Resp)
	require.Equal(t, "my-dataset", fnCopy.Req.Dataset.String())
	require.Equal(t, "store-123", fnCopy.Req.DashPartitions.StoreId)
	require.Equal(t, "2024-01", fnCopy.Req.Params.MinYearMonth)
	require.Equal(t, "2024-12", fnCopy.Req.Params.MaxYearMonth)
	require.Len(t, fnCopy.Resp.Results.Rows, 2)
	require.Equal(t, 1500.5, fnCopy.Resp.Results.Rows[0].AttachedRevenue)
	require.Equal(t, 12.0, fnCopy.Resp.Results.Rows[0].AttachedPurchases)
	require.Equal(t, 30.0, fnCopy.Resp.Results.Rows[0].AttachedSkus)
	require.Equal(t, 125.04, fnCopy.Resp.Results.Rows[0].AvgTicket)
	require.Equal(t, 10.0, fnCopy.Resp.Results.Rows[1].AttachedRevenue)
	require.Equal(t, 2.0, fnCopy.Resp.Results.Rows[1].AttachedSkus)
}

func TestUnitRelevanceFashionDashAttachedRevenueSpec(t *testing.T) {
	fn := &relevancefashiondashattachedrevenue.Func{}
	spec := fn.SdkFuncSpec()
	require.Equal(t, "product-relevance-fashion-dash-attached-revenue", spec.Id)
	require.Equal(t, "v1", spec.Version)
	require.Equal(t, sdkfuncz.TypClientQuery, spec.Typ)
	require.NotNil(t, spec.Desc)
}

func TestUnitRelevanceFashionDashAttachedRevenueDataRefs(t *testing.T) {
	ctx := t.Context()
	fn := &relevancefashiondashattachedrevenue.Func{}
	refs := fn.SdkFuncDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.Input)
	require.NotNil(t, refs.Partitions)
	require.NotNil(t, refs.Output)

	tdInput, tdsInput := jsparser.ParseSchema(ctx, "attachedRevenueInput", refs.Input)
	require.NotNil(t, tdInput)
	require.Equal(t, "attachedRevenueInput", tdInput.Head.Name)
	require.Equal(t, "object", tdInput.Head.Typ)
	require.NotNil(t, tdsInput)

	inputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdInput.Properties.All() {
		inputProps[prop.Name] = prop
	}
	require.Contains(t, inputProps, "dataset")
	require.Equal(t, "string", inputProps["dataset"].Typ)
	require.Contains(t, inputProps, "params")
	require.Equal(t, "attachedRevenueInputParams", inputProps["params"].Typ)
	require.Contains(t, typedefNames(tdsInput), "attachedRevenueInputParams")

	tdPartitions, tdsPartitions := jsparser.ParseSchema(ctx, "attachedRevenuePartitions", refs.Partitions)
	require.NotNil(t, tdPartitions)
	require.Equal(t, "attachedRevenuePartitions", tdPartitions.Head.Name)
	require.Equal(t, "object", tdPartitions.Head.Typ)
	require.NotNil(t, tdsPartitions)

	partitionProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdPartitions.Properties.All() {
		partitionProps[prop.Name] = prop
	}
	require.Contains(t, partitionProps, "store_id")
	require.Equal(t, "string", partitionProps["store_id"].Typ)

	tdOutput, tdsOutput := jsparser.ParseSchema(ctx, "attachedRevenueOutput", refs.Output)
	require.NotNil(t, tdOutput)
	require.Equal(t, "attachedRevenueOutput", tdOutput.Head.Name)
	require.Equal(t, "object", tdOutput.Head.Typ)
	require.NotNil(t, tdsOutput)

	outputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdOutput.Properties.All() {
		outputProps[prop.Name] = prop
	}
	require.Contains(t, outputProps, "rows")
	require.Equal(t, "Array<attachedRevenueOutputRowsElement>", outputProps["rows"].Typ)

	tdfMapOutput := make(map[string]*jstypez.Typedef)
	for _, tdf := range tdsOutput.All() {
		tdfMapOutput[tdf.Head.Name] = tdf
	}
	rowsElemTdf, ok := tdfMapOutput["attachedRevenueOutputRowsElement"]
	require.True(t, ok)
	require.NotNil(t, rowsElemTdf)
	rowsElemProps := make(map[string]jstypez.Tuple)
	for _, prop := range rowsElemTdf.Properties.All() {
		rowsElemProps[prop.Name] = prop
	}
	require.Contains(t, rowsElemProps, "attached_revenue")
	require.Equal(t, "number", rowsElemProps["attached_revenue"].Typ)
	require.Contains(t, rowsElemProps, "attached_purchases")
	require.Equal(t, "number", rowsElemProps["attached_purchases"].Typ)
	require.Contains(t, rowsElemProps, "attached_skus")
	require.Equal(t, "number", rowsElemProps["attached_skus"].Typ)
	require.Contains(t, rowsElemProps, "avg_ticket")
	require.Equal(t, "number", rowsElemProps["avg_ticket"].Typ)
}

func typedefNames(tds *jstypez.Typedefs) []string {
	var ret []string
	for _, td := range tds.All() {
		ret = append(ret, td.Head.Name)
	}
	return ret
}
