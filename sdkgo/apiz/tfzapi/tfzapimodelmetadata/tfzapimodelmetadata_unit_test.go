package tfzapimodelmetadata_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/tfzapi/tfzapimodelmetadata"
)

func TestUnitModelMetadataApi(t *testing.T) {
	ctx := t.Context()
	api := &tfzapimodelmetadata.Api{
		Req: &tfzapimodelmetadata.Req{
			ModelName: "embedding_model",
			Version:   "v1.0.0",
		},
		Resp: &tfzapimodelmetadata.Resp{
			Inputs: []tfzapimodelmetadata.TensorDetail{
				{
					Name:  "input_1",
					Index: 0,
					Shape: []int{1, 256},
					DType: "float32",
				},
			},
			Outputs: []tfzapimodelmetadata.TensorDetail{
				{
					Name:  "output_1",
					Index: 0,
					Shape: []int{1, 128},
					DType: "float32",
				},
			},
		},
	}

	apiCopy := jsonz.MustCopy(api, &tfzapimodelmetadata.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)
	require.Equal(t, "embedding_model", apiCopy.Req.ModelName)
	require.Equal(t, "v1.0.0", apiCopy.Req.Version)
	require.Len(t, apiCopy.Resp.Inputs, 1)
	require.Equal(t, "input_1", apiCopy.Resp.Inputs[0].Name)
	require.Equal(t, []int{1, 256}, apiCopy.Resp.Inputs[0].Shape)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "tfz-model-metadata", parsed.Spec.Id)
}
