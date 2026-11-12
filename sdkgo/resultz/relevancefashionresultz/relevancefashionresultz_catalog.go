package relevancefashionresultz

import (
	"context"
	"fmt"

	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/urlz"
	"github.com/infinity6-ai/gox/fsz/fszjson"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbpathz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
)

type CatalogSimpleReq struct {
	StoreId storeid.StoreId
}

type CatalogSimpleData struct {
	StoreId storeid.StoreId `json:"store_id" bigquery:"store_id"`
	SkuId   string          `json:"sku_id" bigquery:"sku_id"`
	SkuDs   string          `json:"sku_ds" bigquery:"sku_ds"`
}

type CatalogSimple struct {
	Req  CatalogSimpleReq
	Resp []*CatalogSimpleData
}

func (c *CatalogSimple) Download(ctx context.Context, u *urlz.Url) bool {
	found, _, err := fszjson.DownloadSlice(ctx, &c.Resp, fszjson.DownloadOptions{
		Url:  u,
		Gzip: true,
	})
	errorz.Check(err)
	return found
}

func (c *CatalogSimple) ResultName() string {
	return "relevance-fashion-catalog"
}

func (c *CatalogSimple) QuerySchema() *schemaz.Schema {
	return &schemaz.Schema{
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"store_id": {
					Desc:     &schemaz.Desc{Summary: "Store ID to query."},
					UrlValue: schemaz.ParseStrGet(&c.Req.StoreId, storeid.MustParse),
				},
			}
		},
	}
}

func (c *CatalogSimple) Path() laketbpathz.Path {
	return laketbpathz.MustParse(fmt.Sprintf("i6tb://results.relevance-fashion-catalog/store_id=%s/part.json.gz", c.Req.StoreId))
}

func (c *CatalogSimple) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{Summary: "Store simple catalog loaded from the datalake file."},
		Array: schemaz.NewArray(schemaz.ArrayOptions[[]*CatalogSimpleData, *CatalogSimpleData]{
			Slice: func() *[]*CatalogSimpleData { return &c.Resp },
			NewElement: func(idx int) *CatalogSimpleData {
				return &CatalogSimpleData{}
			},
			Get: func(idx int, element **CatalogSimpleData) *schemaz.Schema {
				return &schemaz.Schema{
					Object: func(read bool) map[string]*schemaz.Schema {
						return map[string]*schemaz.Schema{
							"store_id": {
								Desc:  &schemaz.Desc{Summary: "Store identifier."},
								Field: func() any { return &(*element).StoreId },
							},
							"sku_id": {
								Desc:  &schemaz.Desc{Summary: "SKU identifier."},
								Field: func() any { return &(*element).SkuId },
							},
							"sku_ds": {
								Desc:  &schemaz.Desc{Summary: "SKU description."},
								Field: func() any { return &(*element).SkuDs },
							},
						}
					},
				}
			},
		}),
	}

}
