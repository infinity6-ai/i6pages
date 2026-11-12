package relevancefashiondashcoverage_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparser"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashcoverage"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
)

func TestUnitRelevanceFashionDashCoverage(t *testing.T) {
	fn := &relevancefashiondashcoverage.Func{
		Req: relevancefashiondashcoverage.Req{
			Dataset:        lakedsz.MustParse("my-dataset"),
			DashPartitions: relevancefashiondashcoverage.Partitions{StoreId: "store-123"},
			Params: relevancefashiondashcoverage.Params{
				MinYearMonth: "2026-07",
				MaxYearMonth: "2026-09",
			},
		},
		Resp: relevancefashiondashcoverage.Resp{
			Results: relevancefashiondashcoverage.Result{
				Rows: []*relevancefashiondashcoverage.Row{{
					RecomendationCoverage: 1.0,
					RecommendedItems:      166,
					RecommendableItems:    166,
					LongTailCoverage:      0.5,
					Top1Coverage:          1.0,
					Top1To5Coverage:       0.9,
					Top5To10Coverage:      0.8,
					Bottom90Coverage:      0.7,
				}},
			},
		},
	}

	fnCopy := jsonz.MustCopy(fn, &relevancefashiondashcoverage.Func{})

	require.Equal(t, fn.Req, fnCopy.Req)
	require.Equal(t, fn.Resp, fnCopy.Resp)
	require.Equal(t, "my-dataset", fnCopy.Req.Dataset.String())
	require.Equal(t, "store-123", fnCopy.Req.DashPartitions.StoreId)
	require.Equal(t, "2026-07", fnCopy.Req.Params.MinYearMonth)
	require.Equal(t, "2026-09", fnCopy.Req.Params.MaxYearMonth)
	require.Len(t, fnCopy.Resp.Results.Rows, 1)
	require.Equal(t, 166.0, fnCopy.Resp.Results.Rows[0].RecommendedItems)
	require.Equal(t, 0.7, fnCopy.Resp.Results.Rows[0].Bottom90Coverage)
}

func TestUnitRelevanceFashionDashCoverageSpec(t *testing.T) {
	fn := &relevancefashiondashcoverage.Func{}
	spec := fn.SdkFuncSpec()
	require.Equal(t, "product-relevance-fashion-dash-coverage", spec.Id)
	require.Equal(t, "v1", spec.Version)
	require.Equal(t, sdkfuncz.TypClientQuery, spec.Typ)
	require.NotNil(t, spec.Desc)
}

func TestUnitRelevanceFashionDashCoverageDataRefs(t *testing.T) {
	ctx := t.Context()
	fn := &relevancefashiondashcoverage.Func{}
	refs := fn.SdkFuncDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.Input)
	require.NotNil(t, refs.Partitions)
	require.NotNil(t, refs.Output)

	tdInput, _ := jsparser.ParseSchema(ctx, "coverageInput", refs.Input)
	require.Equal(t, "object", tdInput.Head.Typ)

	tdPartitions, _ := jsparser.ParseSchema(ctx, "coveragePartitions", refs.Partitions)
	require.Equal(t, "object", tdPartitions.Head.Typ)

	tdOutput, tdsOutput := jsparser.ParseSchema(ctx, "coverageOutput", refs.Output)
	require.Equal(t, "object", tdOutput.Head.Typ)

	outputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdOutput.Properties.All() {
		outputProps[prop.Name] = prop
	}
	require.Equal(t, "Array<coverageOutputRowsElement>", outputProps["rows"].Typ)

	var rowsElem *jstypez.Typedef
	for _, tdf := range tdsOutput.All() {
		if tdf.Head.Name == "coverageOutputRowsElement" {
			rowsElem = tdf
		}
	}
	require.NotNil(t, rowsElem)
	props := make(map[string]jstypez.Tuple)
	for _, prop := range rowsElem.Properties.All() {
		props[prop.Name] = prop
	}
	for _, name := range []string{"recomendation_coverage", "recommended_items", "recommendable_items", "long_tail_coverage", "top_1_coverage", "top_1_to_5_coverage", "top_5_to_10_coverage", "bottom_90_coverage"} {
		require.Contains(t, props, name)
		require.Equal(t, "number", props[name].Typ)
	}
}
