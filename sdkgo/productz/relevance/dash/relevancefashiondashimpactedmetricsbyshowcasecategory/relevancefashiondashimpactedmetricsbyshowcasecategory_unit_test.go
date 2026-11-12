package relevancefashiondashimpactedmetricsbyshowcasecategory_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparser"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashimpactedmetricsbyshowcasecategory"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
)

func TestUnitRelevanceFashionDashImpactedMetricsByShowcaseCategory(t *testing.T) {
	fn := &relevancefashiondashimpactedmetricsbyshowcasecategory.Func{
		Req: relevancefashiondashimpactedmetricsbyshowcasecategory.Req{
			Dataset: lakedsz.MustParse("my-dataset"),
			DashPartitions: relevancefashiondashimpactedmetricsbyshowcasecategory.Partitions{
				StoreId: "store-123",
			},
			Params: relevancefashiondashimpactedmetricsbyshowcasecategory.Params{
				MinYearMonth: "2026-07",
				MaxYearMonth: "2026-09",
			},
		},
		Resp: relevancefashiondashimpactedmetricsbyshowcasecategory.Resp{
			Results: relevancefashiondashimpactedmetricsbyshowcasecategory.Result{
				Rows: []*relevancefashiondashimpactedmetricsbyshowcasecategory.Row{
					{
						ShowcaseCategory: strPtr("shirt"),
						Recomendations:   205,
						Clicks:           5,
						CartAdds:         3,
						Purchases:        3,
						Revenue:          1368.01,
						Participation:    0.12,
						ConversionRate:   0.6,
					},
					{
						ShowcaseCategory: nil,
						Recomendations:   226,
						Clicks:           6,
						CartAdds:         5,
						Purchases:        3,
						Revenue:          103.5,
						Participation:    0.08,
						ConversionRate:   0.5,
					},
				},
			},
		},
	}

	fnCopy := jsonz.MustCopy(fn, &relevancefashiondashimpactedmetricsbyshowcasecategory.Func{})

	require.Equal(t, fn.Req, fnCopy.Req)
	require.Equal(t, fn.Resp, fnCopy.Resp)
	require.Equal(t, "my-dataset", fnCopy.Req.Dataset.String())
	require.Equal(t, "store-123", fnCopy.Req.DashPartitions.StoreId)
	require.Equal(t, "2026-07", fnCopy.Req.Params.MinYearMonth)
	require.Equal(t, "2026-09", fnCopy.Req.Params.MaxYearMonth)
	require.Len(t, fnCopy.Resp.Results.Rows, 2)
	require.Equal(t, "shirt", *fnCopy.Resp.Results.Rows[0].ShowcaseCategory)
	require.Nil(t, fnCopy.Resp.Results.Rows[1].ShowcaseCategory)
	require.Equal(t, fn.Resp.Results.Rows[0].Revenue, fnCopy.Resp.Results.Rows[0].Revenue)
}

func TestUnitRelevanceFashionDashImpactedMetricsByShowcaseCategorySpec(t *testing.T) {
	fn := &relevancefashiondashimpactedmetricsbyshowcasecategory.Func{}
	spec := fn.SdkFuncSpec()
	require.Equal(t, "product-relevance-fashion-dash-impacted-metrics-by-showcase-category", spec.Id)
	require.Equal(t, "v1", spec.Version)
	require.Equal(t, sdkfuncz.TypClientQuery, spec.Typ)
	require.NotNil(t, spec.Desc)
}

func TestUnitRelevanceFashionDashImpactedMetricsByShowcaseCategoryDataRefs(t *testing.T) {
	ctx := t.Context()
	fn := &relevancefashiondashimpactedmetricsbyshowcasecategory.Func{}
	refs := fn.SdkFuncDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.Input)
	require.NotNil(t, refs.Partitions)
	require.NotNil(t, refs.Output)

	tdInput, tdsInput := jsparser.ParseSchema(ctx, "impactedMetricsByShowcaseCategoryInput", refs.Input)
	require.NotNil(t, tdInput)
	require.Equal(t, "impactedMetricsByShowcaseCategoryInput", tdInput.Head.Name)
	require.Equal(t, "object", tdInput.Head.Typ)
	require.NotNil(t, tdsInput)

	inputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdInput.Properties.All() {
		inputProps[prop.Name] = prop
	}
	require.Contains(t, inputProps, "dataset")
	require.Equal(t, "string", inputProps["dataset"].Typ)
	require.Contains(t, inputProps, "params")
	require.Equal(t, "impactedMetricsByShowcaseCategoryInputParams", inputProps["params"].Typ)
	require.Contains(t, typedefNames(tdsInput), "impactedMetricsByShowcaseCategoryInputParams")

	tdPartitions, tdsPartitions := jsparser.ParseSchema(ctx, "impactedMetricsByShowcaseCategoryPartitions", refs.Partitions)
	require.NotNil(t, tdPartitions)
	require.Equal(t, "impactedMetricsByShowcaseCategoryPartitions", tdPartitions.Head.Name)
	require.Equal(t, "object", tdPartitions.Head.Typ)
	require.NotNil(t, tdsPartitions)

	partitionProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdPartitions.Properties.All() {
		partitionProps[prop.Name] = prop
	}
	require.Contains(t, partitionProps, "store_id")
	require.Equal(t, "string", partitionProps["store_id"].Typ)

	tdOutput, tdsOutput := jsparser.ParseSchema(ctx, "impactedMetricsByShowcaseCategoryOutput", refs.Output)
	require.NotNil(t, tdOutput)
	require.Equal(t, "impactedMetricsByShowcaseCategoryOutput", tdOutput.Head.Name)
	require.Equal(t, "object", tdOutput.Head.Typ)
	require.NotNil(t, tdsOutput)

	outputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdOutput.Properties.All() {
		outputProps[prop.Name] = prop
	}
	require.Contains(t, outputProps, "rows")
	require.Equal(t, "Array<impactedMetricsByShowcaseCategoryOutputRowsElement>", outputProps["rows"].Typ)

	tdfMapOutput := make(map[string]*jstypez.Typedef)
	for _, tdf := range tdsOutput.All() {
		tdfMapOutput[tdf.Head.Name] = tdf
	}
	rowsElemTdf, ok := tdfMapOutput["impactedMetricsByShowcaseCategoryOutputRowsElement"]
	require.True(t, ok)
	require.NotNil(t, rowsElemTdf)
	rowsElemProps := make(map[string]jstypez.Tuple)
	for _, prop := range rowsElemTdf.Properties.All() {
		rowsElemProps[prop.Name] = prop
	}
	require.Contains(t, rowsElemProps, "showcase_category")
	require.Equal(t, "string", rowsElemProps["showcase_category"].Typ)
	require.Contains(t, rowsElemProps, "recomendations")
	require.Equal(t, "number", rowsElemProps["recomendations"].Typ)
	require.Contains(t, rowsElemProps, "clicks")
	require.Equal(t, "number", rowsElemProps["clicks"].Typ)
	require.Contains(t, rowsElemProps, "cart_adds")
	require.Equal(t, "number", rowsElemProps["cart_adds"].Typ)
	require.Contains(t, rowsElemProps, "purchases")
	require.Equal(t, "number", rowsElemProps["purchases"].Typ)
	require.Contains(t, rowsElemProps, "revenue")
	require.Equal(t, "number", rowsElemProps["revenue"].Typ)
	require.Contains(t, rowsElemProps, "participation")
	require.Equal(t, "number", rowsElemProps["participation"].Typ)
	require.Contains(t, rowsElemProps, "conversion_rate")
	require.Equal(t, "number", rowsElemProps["conversion_rate"].Typ)
}

func typedefNames(tds *jstypez.Typedefs) []string {
	var ret []string
	for _, td := range tds.All() {
		ret = append(ret, td.Head.Name)
	}
	return ret
}

func strPtr(s string) *string {
	return &s
}
