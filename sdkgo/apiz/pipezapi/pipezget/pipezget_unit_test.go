package pipezget_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/pipezapi/pipezget"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solutiondomain"
	"go.code.infinity6.ai/sdkgo/sdkgo/pipez"
)

func TestUnitPipezGetApi(t *testing.T) {
	api := &pipezget.Api{
		Req: &pipezget.PipezGetReq{
			Dataset: lakedsz.MustParse("myds"),
			Id:      "pipe-123",
		},
		Resp: &pipezget.PipezGetResp{
			Pipeline: &pipez.Pipeline{
				Id:             "pipe-123",
				ConcurrentId:   "concurrent-123",
				SolutionDomain: solutiondomain.MustParseString("relevance_fashion"),
				Name:           "mypipe",
				Dataset:        "myds",
				States: []*pipez.PipeState{
					{
						Status:    "CREATED",
						Params:    map[string]any{"foo": "bar"},
						CreatedAt: "2026-10-13T12:00:00Z",
					},
				},
			},
		},
	}

	api2 := jsonz.MustCopy(api, &pipezget.Api{})

	require.Equal(t, api.Req.Dataset, api2.Req.Dataset)
	require.Equal(t, api.Req.Id, api2.Req.Id)
	require.NotNil(t, api2.Resp.Pipeline)
	require.Equal(t, api.Resp.Pipeline.Id, api2.Resp.Pipeline.Id)
	require.Equal(t, api.Resp.Pipeline.ConcurrentId, api2.Resp.Pipeline.ConcurrentId)
	require.Equal(t, api.Resp.Pipeline.SolutionDomain, api2.Resp.Pipeline.SolutionDomain)
	require.Equal(t, api.Resp.Pipeline.Name, api2.Resp.Pipeline.Name)
	require.Equal(t, api.Resp.Pipeline.Dataset, api2.Resp.Pipeline.Dataset)
	require.Equal(t, len(api.Resp.Pipeline.States), len(api2.Resp.Pipeline.States))
	require.Equal(t, api.Resp.Pipeline.States[0].Status, api2.Resp.Pipeline.States[0].Status)
}
