package pipezlist_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/pipezapi/pipezlist"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/domain"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solutiondomain"
	"go.code.infinity6.ai/sdkgo/sdkgo/pipez"
)

func TestUnitPipezListApi(t *testing.T) {
	api := &pipezlist.Api{
		Req: &pipezlist.PipezListReq{
			Dataset: lakedsz.MustParse("myds"),
			SolutionDomain: solutiondomain.MustParse(solutiondomain.Value{
				Solution: solution.Relevance().Solution,
				Domain:   domain.MustParse("fashion"),
			}),
			Name:   "mypipe",
			Status: "CREATED",
			Cursor: "mycursor",
			Limit:  10,
		},
		Resp: &pipezlist.PipezListResp{
			Pipelines: []*pipez.Pipeline{
				{
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
			Cursor: "next-cursor",
		},
	}

	api2 := jsonz.MustCopy(api, &pipezlist.Api{})

	require.Equal(t, api.Req.Dataset, api2.Req.Dataset)
	require.Equal(t, api.Req.SolutionDomain, api2.Req.SolutionDomain)
	require.Equal(t, api.Req.Name, api2.Req.Name)
	require.Equal(t, api.Req.Status, api2.Req.Status)
	require.Equal(t, api.Req.Cursor, api2.Req.Cursor)
	require.Equal(t, api.Req.Limit, api2.Req.Limit)
	require.Equal(t, len(api.Resp.Pipelines), len(api2.Resp.Pipelines))
	require.Equal(t, api.Resp.Pipelines[0].Id, api2.Resp.Pipelines[0].Id)
	require.Equal(t, api.Resp.Pipelines[0].States[0].Status, api2.Resp.Pipelines[0].States[0].Status)
	require.Equal(t, api.Resp.Cursor, api2.Resp.Cursor)
}
