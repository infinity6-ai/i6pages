package inferzrelevancefashionfbt_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparser"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/inferz/inferzrelevancefashionfbt"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
)

func TestUnitInferzRelevanceFashionFbt(t *testing.T) {
	fn := &inferzrelevancefashionfbt.Func{
		Req: inferzrelevancefashionfbt.Req{
			Dataset: lakedsz.MustParse("my-dataset"),
			Skus: []*inferzrelevancefashionfbt.Sku{
				{
					SkuId: "sku-1",
				},
				{
					SkuId: "sku-2",
				},
			},
			ModelPartitions: inferzrelevancefashionfbt.Partitions{
				StoreId: "store-123",
			},
		},
		Resp: inferzrelevancefashionfbt.Resp{
			Results: []*inferzrelevancefashionfbt.Result{
				{
					Skus:   []*inferzrelevancefashionfbt.Sku{{SkuId: "sku-3"}},
					Rating: 0.95,
				},
				{
					Skus:   []*inferzrelevancefashionfbt.Sku{{SkuId: "sku-4"}},
					Rating: 0.85,
				},
			},
		},
	}

	fnCopy := jsonz.MustCopy(fn, &inferzrelevancefashionfbt.Func{})

	require.Equal(t, fn.Req, fnCopy.Req)
	require.Equal(t, fn.Resp, fnCopy.Resp)
	require.Equal(t, "my-dataset", fnCopy.Req.Dataset.String())
	require.Len(t, fnCopy.Req.Skus, 2)
	require.Equal(t, "sku-1", fnCopy.Req.Skus[0].SkuId)
	require.Equal(t, "sku-2", fnCopy.Req.Skus[1].SkuId)
	require.Equal(t, "store-123", fnCopy.Req.ModelPartitions.StoreId)
	require.Len(t, fnCopy.Resp.Results, 2)
	require.Equal(t, "sku-3", fnCopy.Resp.Results[0].Skus[0].SkuId)
	require.Equal(t, 0.95, fnCopy.Resp.Results[0].Rating)
	require.Equal(t, "sku-4", fnCopy.Resp.Results[1].Skus[0].SkuId)
	require.Equal(t, 0.85, fnCopy.Resp.Results[1].Rating)
}

func TestUnitInferzRelevanceFashionFbtSpec(t *testing.T) {
	fn := &inferzrelevancefashionfbt.Func{}
	spec := fn.SdkFuncSpec()
	require.Equal(t, "product-relevance-fashion-fbt", spec.Id)
	require.Equal(t, "v1", spec.Version)
	require.Equal(t, sdkfuncz.TypClientInfer, spec.Typ)
	require.NotNil(t, spec.Desc)
}

func TestUnitInferzRelevanceFashionFbtDataRefs(t *testing.T) {
	ctx := t.Context()
	fn := &inferzrelevancefashionfbt.Func{}
	refs := fn.SdkFuncDataRefs()
	require.NotNil(t, refs)
	require.NotNil(t, refs.Input)
	require.NotNil(t, refs.Partitions)
	require.NotNil(t, refs.Output)

	tdInput, tdsInput := jsparser.ParseSchema(ctx, "fbtInput", refs.Input)
	require.NotNil(t, tdInput)
	require.Equal(t, "fbtInput", tdInput.Head.Name)
	require.Equal(t, "object", tdInput.Head.Typ)
	require.NotNil(t, tdsInput)

	inputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdInput.Properties.All() {
		inputProps[prop.Name] = prop
	}
	require.Contains(t, inputProps, "dataset")
	require.Equal(t, "string", inputProps["dataset"].Typ)
	require.Contains(t, inputProps, "skus")
	require.Equal(t, "Array<fbtInputSkusElement>", inputProps["skus"].Typ)

	tdfMapInput := make(map[string]*jstypez.Typedef)
	for _, tdf := range tdsInput.All() {
		tdfMapInput[tdf.Head.Name] = tdf
	}
	skusElemTdf, ok := tdfMapInput["fbtInputSkusElement"]
	require.True(t, ok)
	require.NotNil(t, skusElemTdf)
	skusElemProps := make(map[string]jstypez.Tuple)
	for _, prop := range skusElemTdf.Properties.All() {
		skusElemProps[prop.Name] = prop
	}
	require.Contains(t, skusElemProps, "sku_id")
	require.Equal(t, "string", skusElemProps["sku_id"].Typ)

	tdPartitions, tdsPartitions := jsparser.ParseSchema(ctx, "fbtPartitions", refs.Partitions)
	require.NotNil(t, tdPartitions)
	require.Equal(t, "fbtPartitions", tdPartitions.Head.Name)
	require.Equal(t, "object", tdPartitions.Head.Typ)
	require.NotNil(t, tdsPartitions)

	partitionProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdPartitions.Properties.All() {
		partitionProps[prop.Name] = prop
	}
	require.Contains(t, partitionProps, "store_id")
	require.Equal(t, "string", partitionProps["store_id"].Typ)

	tdOutput, tdsOutput := jsparser.ParseSchema(ctx, "fbtOutput", refs.Output)
	require.NotNil(t, tdOutput)
	require.Equal(t, "fbtOutput", tdOutput.Head.Name)
	require.Equal(t, "object", tdOutput.Head.Typ)
	require.NotNil(t, tdsOutput)

	outputProps := make(map[string]jstypez.Tuple)
	for _, prop := range tdOutput.Properties.All() {
		outputProps[prop.Name] = prop
	}
	require.Contains(t, outputProps, "results")
	require.Equal(t, "Array<fbtOutputResultsElement>", outputProps["results"].Typ)

	tdfMapOutput := make(map[string]*jstypez.Typedef)
	for _, tdf := range tdsOutput.All() {
		tdfMapOutput[tdf.Head.Name] = tdf
	}
	resultsElemTdf, ok := tdfMapOutput["fbtOutputResultsElement"]
	require.True(t, ok)
	require.NotNil(t, resultsElemTdf)
	resultsElemProps := make(map[string]jstypez.Tuple)
	for _, prop := range resultsElemTdf.Properties.All() {
		resultsElemProps[prop.Name] = prop
	}
	require.Contains(t, resultsElemProps, "skus")
	require.Equal(t, "Array<fbtOutputResultsElementSkusElement>", resultsElemProps["skus"].Typ)
	require.Contains(t, resultsElemProps, "rating")
	require.Equal(t, "number", resultsElemProps["rating"].Typ)

	skusElemOutputTdf, ok := tdfMapOutput["fbtOutputResultsElementSkusElement"]
	require.True(t, ok)
	require.NotNil(t, skusElemOutputTdf)
	skusElemOutputProps := make(map[string]jstypez.Tuple)
	for _, prop := range skusElemOutputTdf.Properties.All() {
		skusElemOutputProps[prop.Name] = prop
	}
	require.Contains(t, skusElemOutputProps, "sku_id")
	require.Equal(t, "string", skusElemOutputProps["sku_id"].Typ)
}
