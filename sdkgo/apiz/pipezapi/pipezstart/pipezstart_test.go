package pipezstart_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/pipezapi/pipezstart"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbnamez"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/pipez/relevancefashionpipez"
)

func TestUnitPipezApi(t *testing.T) {
	t.Run("Batch Ingest Pipeline", func(t *testing.T) {
		api := &pipezstart.Api[*relevancefashionpipez.BatchIngest]{
			Req: &pipezstart.PipezStartReq[*relevancefashionpipez.BatchIngest]{
				Dataset: lakedsz.MustParse("bla1234"),
				Params: &relevancefashionpipez.BatchIngest{
					Dataset:  "bla1234",
					IngestId: "20261013T224538808Z",
					Table:    laketbnamez.MustParse("relevance-fashion-catalog"),
				},
			},
		}

		api2 := jsonz.MustCopy(api, &pipezstart.Api[*relevancefashionpipez.BatchIngest]{})
		require.Equal(t, *api.Req, *api2.Req)

		require.Equal(t, map[string]string{
			"dataset":     "bla1234",
			"ingested_at": "20261013T224538808Z",
			"table":       "relevance-fashion-catalog",
		}, api.Req.Params.Params())
	})

	t.Run("Main Pipeline", func(t *testing.T) {
		api := &pipezstart.Api[*relevancefashionpipez.Main]{
			Req: &pipezstart.PipezStartReq[*relevancefashionpipez.Main]{
				Dataset: lakedsz.MustParse("dectest"),
				Params: &relevancefashionpipez.Main{
					Dataset: "dectest",
				},
			},
		}

		api2 := jsonz.MustCopy(api, &pipezstart.Api[*relevancefashionpipez.Main]{})
		require.Equal(t, *api.Req, *api2.Req)

		require.Equal(t, map[string]string{
			"dataset": "dectest",
		}, api.Req.Params.Params())
	})
}
