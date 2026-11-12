package dszapimodelget_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapimodelget"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
)

func TestUnitModelzApiSignedGet(t *testing.T) {
	api := &dszapimodelget.Api{
		Req: dszapimodelget.Req{
			Dataset:      lakedsz.MustParse("myds"),
			ModelName:    "embedding_model",
			ModelVersion: "v1.0.0",
			ModelPartitions: map[string]string{
				"channel": "retail",
				"locale":  "en-US",
			},
		},
		Resp: dszapimodelget.Resp{
			Urls: []*dszapimodelget.ModelFile{
				{
					Name: "model.onnx",
					Url:  "https://example.com/models/embedding_model/model.onnx",
				},
				{
					Name: "config.json",
					Url:  "https://example.com/models/embedding_model/config.json",
				},
			},
		},
	}

	apiCopy := jsonz.MustCopy(api, &dszapimodelget.Api{})

	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)
	require.Equal(t, "v1.0.0", apiCopy.Req.ModelVersion)
	require.Equal(t, "retail", apiCopy.Req.ModelPartitions["channel"])
	require.Len(t, apiCopy.Resp.Urls, 2)
}

func TestUnitModelzApiSignedGetParseApi(t *testing.T) {
	ctx := t.Context()
	api := &dszapimodelget.Api{}
	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "dsz-model-get", parsed.Spec.Id)
	require.Equal(t, "apiDszModelGet", parsed.Spec.CamelId)
	require.Equal(t, "POST", parsed.Spec.Method)
	require.Equal(t, "/api/model/dataset/{dataset}/signed-get/{model_name}", parsed.Spec.Path)

	require.Equal(t, "apiDszModelGetParams", parsed.Req.Params.Head.Typ)
	require.Equal(t, "params", parsed.Req.Params.Head.Name)
	require.Equal(t, "apiDszModelGetReqPayload", parsed.Req.Payload.Head.Typ)
	require.Equal(t, "reqPayload", parsed.Req.Payload.Head.Name)
	require.Equal(t, "apiDszModelGetRespPayload", parsed.Resp.Payload.Head.Typ)
	require.Equal(t, "respPayload", parsed.Resp.Payload.Head.Name)

	tdfMap := make(map[string]*jstypez.Typedef)
	for _, tdf := range parsed.Typedefs.All() {
		tdfMap[tdf.Head.Name] = tdf
	}

	reqPayloadTdf, ok := tdfMap["apiDszModelGetReqPayload"]
	require.True(t, ok)
	require.NotNil(t, reqPayloadTdf)
	require.NotNil(t, reqPayloadTdf.Properties)

	propMap := make(map[string]jstypez.Tuple)
	for _, prop := range reqPayloadTdf.Properties.All() {
		propMap[prop.Name] = prop
	}
	require.Contains(t, propMap, "model_version")
	require.Equal(t, "string", propMap["model_version"].Typ)
	require.Contains(t, propMap, "model_partitions")
	require.Equal(t, "Record<apiDszModelGetReqPayloadModelPartitionsKey, apiDszModelGetReqPayloadModelPartitionsValue>", propMap["model_partitions"].Typ)

	respPayloadTdf, ok := tdfMap["apiDszModelGetRespPayload"]
	require.True(t, ok)
	require.NotNil(t, respPayloadTdf)
	require.NotNil(t, respPayloadTdf.Properties)

	respPropMap := make(map[string]jstypez.Tuple)
	for _, prop := range respPayloadTdf.Properties.All() {
		respPropMap[prop.Name] = prop
	}
	require.Contains(t, respPropMap, "urls")
}

func TestUnitModelzApiSignedApiDataRefs(t *testing.T) {
	api := &dszapimodelget.Api{}
	refs := api.ApiDataRefs()

	require.NotNil(t, refs.PathParams)
	require.Nil(t, refs.QueryParams)
	require.Nil(t, refs.ReqHeaders)
	require.NotNil(t, refs.ReqBody)
	require.Nil(t, refs.RespHeaders)
	require.NotNil(t, refs.RespBody)

	// Test ReqBody JSON unmarshaling
	reqBodyJSON := []byte(`{"model_version":"v2.1.0","model_partitions":{"arch":"arm64"}}`)
	err := refs.ReqBody.UnmarshalJSON(reqBodyJSON)
	require.NoError(t, err)
	require.Equal(t, "v2.1.0", api.Req.ModelVersion)
	require.Equal(t, "arm64", api.Req.ModelPartitions["arch"])

	// Test ReqBody JSON marshaling
	marshaledReq, err := refs.ReqBody.MarshalJSON()
	require.NoError(t, err)
	require.JSONEq(t, string(reqBodyJSON), string(marshaledReq))

	// Test RespBody JSON unmarshaling
	respBodyJSON := []byte(`{"urls":[{"name":"model.onnx","url":"https://example.com/model.onnx"}]}`)
	err = refs.RespBody.UnmarshalJSON(respBodyJSON)
	require.NoError(t, err)
	require.Len(t, api.Resp.Urls, 1)
	require.Equal(t, "model.onnx", api.Resp.Urls[0].Name)
	require.Equal(t, "https://example.com/model.onnx", api.Resp.Urls[0].Url)
}
