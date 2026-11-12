package ingestzapievent_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/ingestzapi/ingestzapievent"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/tabledataz/dummydataz"
)

func TestUnitIngestzStreamApi(t *testing.T) {
	ctx := t.Context()
	api := &ingestzapievent.Api[*dummydataz.Catalog]{
		Req: ingestzapievent.Req[*dummydataz.Catalog]{
			Dataset: lakedsz.MustParse("my-dataset"),
			Payload: &dummydataz.Catalog{
				Id:      "obj1",
				Product: "Object 1",
			},
		},
	}

	// Verify standard JSON copy / two-way binding
	apiCopy := jsonz.MustCopy(api, &ingestzapievent.Api[*dummydataz.Catalog]{})
	require.Equal(t, api.Req.Dataset.Get(), apiCopy.Req.Dataset.Get())
	require.NotNil(t, apiCopy.Req.Payload)
	require.Equal(t, api.Req.Payload.Id, apiCopy.Req.Payload.Id)
	require.Equal(t, api.Req.Payload.Product, apiCopy.Req.Payload.Product)

	// Verify API specifications
	spec := api.ApiSpec()
	require.Equal(t, "ingestz-event-dummy-catalog", spec.Id)
	require.Equal(t, "/api/ingest/dataset/{dataset}/event/dummy-catalog/text.txt", spec.Path)

	// Verify Schema parsing and mapping
	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "ingestz-event-dummy-catalog", parsed.Spec.Id)

	// println(jsonz.MustFormatPretty(parsed).String())
	// t.Fail()
}
