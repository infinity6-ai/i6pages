package relevancefashiondashfunnel_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparser"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashfunnel"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
)

func TestUnitRelevanceFashionDashFunnel(t *testing.T) {
	fn := &relevancefashiondashfunnel.Func{
		Req: relevancefashiondashfunnel.Req{
			Dataset: lakedsz.MustParse("my-dataset"),
			DashPartitions: relevancefashiondashfunnel.Partitions{
				StoreId: "store-123",
			},
			Params: relevancefashiondashfunnel.Params{
				MinYearMonth: "2024-01",
				MaxYearMonth: "2024-12",
			},
		},
		Resp: relevancefashiondashfunnel.Resp{
			Results: relevancefashiondashfunnel.Result{
				Rows: []*relevancefashiondashfunnel.Row{
					{
						EventType: "click",
						FromRec:   "true",
						QtEvents:  "150",
					},
					{
						EventType: "purchase",
						FromRec:   "false",
						QtEvents:  "25",
					},
				},
			},
		},
	}

	fnCopy := jsonz.MustCopy(fn, &relevancefashiondashfunnel.Func{})

	require.Equal(t, fn.Req, fnCopy.Req)
	require.Equal(t, fn.Resp, fnCopy.Resp)
	require.Equal(t, "my-dataset", fnCopy.Req.Dataset.String())
	require.Equal(t, "store-123", fnCopy.Req.DashPartitions.StoreId)
	require.Equal(t, "2024-01", fnCopy.Req.Params.MinYearMonth)
	require.Equal(t, "2024-12", fnCopy.Req.Params.MaxYearMonth)
	require.Len(t, fnCopy.Resp.Results.Rows, 2)
	require.Equal(t, "click", fnCopy.Resp.Results.Rows[0].EventType)
	require.Equal(t, "true", fnCopy.Resp.Results.Rows[0].FromRec)
	require.Equal(t, "150", fnCopy.Resp.Results.Rows[0].QtEvents)
	require.Equal(t, "purchase", fnCopy.Resp.Results.Rows[1].EventType)
	require.Equal(t, "false", fnCopy.Resp.Results.Rows[1].FromRec)
	require.Equal(t, "25", fnCopy.Resp.Results.Rows[1].QtEvents)
}

func TestUnitRelevanceFashionDashFunnelSpec(t *testing.T) {
	fn := &relevancefashiondashfunnel.Func{}
	spec := fn.SdkFuncSpec()
	require.Equal(t, "product-relevance-fashion-dash-funnel", spec.Id)
	require.Equal(t, "v1", spec.Version)
	require.Equal(t, sdkfuncz.TypClientQuery, spec.Typ)
	require.NotNil(t, spec.Desc)
}

func TestUnitRelevanceFashionDashFunnelDataRefs(t *testing.T) {
	ctx := t.Context()
	fn := &relevancefashiondashfunnel.Func{}
	refs := fn.SdkFuncDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.Input)
	require.NotNil(t, refs.Partitions)
	require.NotNil(t, refs.Output)

	tdInput, tdsInput := jsparser.ParseSchema(ctx, "funnelInput", refs.Input)
	require.NotNil(t, tdInput)
	require.Equal(t, "funnelInput", tdInput.Head.Name)
	require.Equal(t, "object", tdInput.Head.Typ)
	require.NotNil(t, tdsInput)

	inputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdInput.Properties.All() {
		inputProps[prop.Name] = prop
	}
	require.Contains(t, inputProps, "dataset")
	require.Equal(t, "string", inputProps["dataset"].Typ)
	require.Contains(t, inputProps, "params")
	require.Equal(t, "funnelInputParams", inputProps["params"].Typ)
	require.Contains(t, typedefNames(tdsInput), "funnelInputParams")

	tdPartitions, tdsPartitions := jsparser.ParseSchema(ctx, "funnelPartitions", refs.Partitions)
	require.NotNil(t, tdPartitions)
	require.Equal(t, "funnelPartitions", tdPartitions.Head.Name)
	require.Equal(t, "object", tdPartitions.Head.Typ)
	require.NotNil(t, tdsPartitions)

	partitionProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdPartitions.Properties.All() {
		partitionProps[prop.Name] = prop
	}
	require.Contains(t, partitionProps, "store_id")
	require.Equal(t, "string", partitionProps["store_id"].Typ)

	tdOutput, tdsOutput := jsparser.ParseSchema(ctx, "funnelOutput", refs.Output)
	require.NotNil(t, tdOutput)
	require.Equal(t, "funnelOutput", tdOutput.Head.Name)
	require.Equal(t, "object", tdOutput.Head.Typ)
	require.NotNil(t, tdsOutput)

	outputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdOutput.Properties.All() {
		outputProps[prop.Name] = prop
	}
	require.Contains(t, outputProps, "rows")
	require.Equal(t, "Array<funnelOutputRowsElement>", outputProps["rows"].Typ)

	tdfMapOutput := make(map[string]*jstypez.Typedef)
	for _, tdf := range tdsOutput.All() {
		tdfMapOutput[tdf.Head.Name] = tdf
	}
	rowsElemTdf, ok := tdfMapOutput["funnelOutputRowsElement"]
	require.True(t, ok)
	require.NotNil(t, rowsElemTdf)
	rowsElemProps := make(map[string]jstypez.Tuple)
	for _, prop := range rowsElemTdf.Properties.All() {
		rowsElemProps[prop.Name] = prop
	}
	require.Contains(t, rowsElemProps, "event_type")
	require.Equal(t, "string", rowsElemProps["event_type"].Typ)
	require.Contains(t, rowsElemProps, "from_rec")
	require.Equal(t, "string", rowsElemProps["from_rec"].Typ)
	require.Contains(t, rowsElemProps, "qt_events")
	require.Equal(t, "string", rowsElemProps["qt_events"].Typ)
}

func typedefNames(tds *jstypez.Typedefs) []string {
	var ret []string
	for _, td := range tds.All() {
		ret = append(ret, td.Head.Name)
	}
	return ret
}
