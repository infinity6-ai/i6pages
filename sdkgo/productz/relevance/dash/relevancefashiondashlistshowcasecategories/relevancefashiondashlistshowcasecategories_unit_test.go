package relevancefashiondashlistshowcasecategories_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparser"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashlistshowcasecategories"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
)

func TestUnitRelevanceFashionDashListShowcaseCategories(t *testing.T) {
	fn := &relevancefashiondashlistshowcasecategories.Func{
		Req: relevancefashiondashlistshowcasecategories.Req{
			Dataset: lakedsz.MustParse("my-dataset"),
			DashPartitions: relevancefashiondashlistshowcasecategories.Partitions{
				StoreId: "store-123",
			},
		},
		Resp: relevancefashiondashlistshowcasecategories.Resp{
			Results: relevancefashiondashlistshowcasecategories.Result{
				Rows: []*relevancefashiondashlistshowcasecategories.Row{
					{
						ShowcaseCategory: strPtr("shirt"),
					},
					{
						ShowcaseCategory: nil,
					},
				},
			},
		},
	}

	fnCopy := jsonz.MustCopy(fn, &relevancefashiondashlistshowcasecategories.Func{})

	require.Equal(t, fn.Req, fnCopy.Req)
	require.Equal(t, fn.Resp, fnCopy.Resp)
	require.Equal(t, "my-dataset", fnCopy.Req.Dataset.String())
	require.Equal(t, "store-123", fnCopy.Req.DashPartitions.StoreId)
	require.Len(t, fnCopy.Resp.Results.Rows, 2)
	require.Equal(t, "shirt", *fnCopy.Resp.Results.Rows[0].ShowcaseCategory)
	require.Nil(t, fnCopy.Resp.Results.Rows[1].ShowcaseCategory)
}

func TestUnitRelevanceFashionDashListShowcaseCategoriesSpec(t *testing.T) {
	fn := &relevancefashiondashlistshowcasecategories.Func{}
	spec := fn.SdkFuncSpec()
	require.Equal(t, "product-relevance-fashion-dash-list-showcase-categories", spec.Id)
	require.Equal(t, "v1", spec.Version)
	require.Equal(t, sdkfuncz.TypClientQuery, spec.Typ)
	require.NotNil(t, spec.Desc)
}

func TestUnitRelevanceFashionDashListShowcaseCategoriesDataRefs(t *testing.T) {
	ctx := t.Context()
	fn := &relevancefashiondashlistshowcasecategories.Func{}
	refs := fn.SdkFuncDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.Input)
	require.NotNil(t, refs.Partitions)
	require.NotNil(t, refs.Output)

	tdInput, tdsInput := jsparser.ParseSchema(ctx, "listShowcaseCategoriesInput", refs.Input)
	require.NotNil(t, tdInput)
	require.Equal(t, "listShowcaseCategoriesInput", tdInput.Head.Name)
	require.Equal(t, "object", tdInput.Head.Typ)
	require.NotNil(t, tdsInput)

	inputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdInput.Properties.All() {
		inputProps[prop.Name] = prop
	}
	require.Contains(t, inputProps, "dataset")
	require.Equal(t, "string", inputProps["dataset"].Typ)
	require.NotContains(t, inputProps, "params")

	tdPartitions, tdsPartitions := jsparser.ParseSchema(ctx, "listShowcaseCategoriesPartitions", refs.Partitions)
	require.NotNil(t, tdPartitions)
	require.Equal(t, "listShowcaseCategoriesPartitions", tdPartitions.Head.Name)
	require.Equal(t, "object", tdPartitions.Head.Typ)
	require.NotNil(t, tdsPartitions)

	partitionProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdPartitions.Properties.All() {
		partitionProps[prop.Name] = prop
	}
	require.Contains(t, partitionProps, "store_id")
	require.Equal(t, "string", partitionProps["store_id"].Typ)

	tdOutput, tdsOutput := jsparser.ParseSchema(ctx, "listShowcaseCategoriesOutput", refs.Output)
	require.NotNil(t, tdOutput)
	require.Equal(t, "listShowcaseCategoriesOutput", tdOutput.Head.Name)
	require.Equal(t, "object", tdOutput.Head.Typ)
	require.NotNil(t, tdsOutput)

	outputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdOutput.Properties.All() {
		outputProps[prop.Name] = prop
	}
	require.Contains(t, outputProps, "rows")
	require.Equal(t, "Array<listShowcaseCategoriesOutputRowsElement>", outputProps["rows"].Typ)

	tdfMapOutput := make(map[string]*jstypez.Typedef)
	for _, tdf := range tdsOutput.All() {
		tdfMapOutput[tdf.Head.Name] = tdf
	}
	rowsElemTdf, ok := tdfMapOutput["listShowcaseCategoriesOutputRowsElement"]
	require.True(t, ok)
	require.NotNil(t, rowsElemTdf)
	rowsElemProps := make(map[string]jstypez.Tuple)
	for _, prop := range rowsElemTdf.Properties.All() {
		rowsElemProps[prop.Name] = prop
	}
	require.Contains(t, rowsElemProps, "showcase_category")
	require.Equal(t, "string", rowsElemProps["showcase_category"].Typ)
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
