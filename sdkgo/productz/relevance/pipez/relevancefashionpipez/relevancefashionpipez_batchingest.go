package relevancefashionpipez

import (
	"fmt"

	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbnamez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solutiondomain"
)

type BatchIngest struct {
	Dataset  string
	IngestId string
	Table    laketbnamez.TableName
}

func (b *BatchIngest) SolutionDomain() solutiondomain.SolutionDomain {
	return solutiondomain.MustParseString("relevance_fashion")
}

func (b *BatchIngest) Pipename() string {
	return "relevance-fashion-batch-ingest"
}

func (b *BatchIngest) Concurrent() string {
	return fmt.Sprintf("d.%s.t.%s.i.%s", b.Dataset, b.Table, b.IngestId)
}

func (b *BatchIngest) SetDataset(ds lakedsz.Dataset) {
	b.Dataset = ds.String()
}

func (b *BatchIngest) Params() map[string]string {
	return map[string]string{
		"dataset":     b.Dataset,
		"ingested_at": b.IngestId,
		"table":       b.Table.String(),
	}
}

func (b *BatchIngest) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"ingest_id": {
					Desc:  &schemaz.Desc{Summary: "Batch ingestion id."},
					Field: func() any { return &b.IngestId },
				},
				"table": {
					Desc:  &schemaz.Desc{Summary: "Table that received the batch."},
					Field: func() any { return &b.Table },
				},
			}
		},
	}
}
