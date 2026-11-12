package ingestzapistream_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/ingestzapi/ingestzapistream"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/tabledataz/dummydataz"
)

func TestUnitIngestzStreamApi(t *testing.T) {
	ctx := t.Context()
	api := &ingestzapistream.Api[*dummydataz.Catalog]{
		Req: ingestzapistream.StreamReq[*dummydataz.Catalog]{
			Dataset: lakedsz.MustParse("my-dataset"),
			Data: []*dummydataz.Catalog{
				{
					Id:      "obj1",
					Product: "Object 1",
				},
			},
		},
	}

	// Verify standard JSON copy / two-way binding
	apiCopy := jsonz.MustCopy(api, &ingestzapistream.Api[*dummydataz.Catalog]{})
	require.Equal(t, api.Req.Dataset.Get(), apiCopy.Req.Dataset.Get())
	require.Len(t, apiCopy.Req.Data, 1)
	require.Equal(t, api.Req.Data[0].Id, apiCopy.Req.Data[0].Id)
	require.Equal(t, api.Req.Data[0].Product, apiCopy.Req.Data[0].Product)

	// Verify API specifications
	spec := api.ApiSpec()
	require.Equal(t, "ingestz-stream-dummy-catalog", spec.Id)
	require.Equal(t, "/api/ingest/dataset/{dataset}/stream/dummy-catalog", spec.Path)

	// Verify Schema parsing and mapping
	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "ingestz-stream-dummy-catalog", parsed.Spec.Id)
}
