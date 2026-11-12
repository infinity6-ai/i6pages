package relevancefashiondataz

import (
	"fmt"
	"time"

	"cloud.google.com/go/bigquery"
	"github.com/infinity6-ai/gox/commonz/validation"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbnamez"
	"go.code.infinity6.ai/sdkgo/sdkgo/tabledataz"
)

// Event represents an interaction event in the Relevance Fashion domain.
//
// Validation rules:
//   - ID, StoreId, SessionId, and CreatedAt are required.
//   - Exactly one event payload (Click, AddToCart, RemoveFromCart, Search, Purchase, Recraw, Recshow) must be set.
//   - DisplayId and UserId are optional.
//   - Dataset and IngestedAt are read-only fields populated by the system during ingestion.
type Event struct {
	ID             string              `json:"id" bigquery:"id"`
	Dataset        bigquery.NullString `json:"dataset" bigquery:"dataset"`
	StoreId        string              `json:"store_id" bigquery:"store_id"`
	SessionId      string              `json:"session_id" bigquery:"session_id"`
	DisplayId      bigquery.NullString `json:"display_id" bigquery:"display_id"`
	UserId         bigquery.NullString `json:"user_id" bigquery:"user_id"`
	Click          *Click              `json:"click,omitempty" bigquery:"click,nullable"`
	AddToCart      *AddToCart          `json:"add_to_cart,omitempty" bigquery:"add_to_cart,nullable"`
	RemoveFromCart *RemoveFromCart     `json:"remove_from_cart,omitempty" bigquery:"remove_from_cart,nullable"`
	Search         *Search             `json:"search,omitempty" bigquery:"search,nullable"`
	Purchase       *Purchase           `json:"purchase,omitempty" bigquery:"purchase,nullable"`
	Recraw         *Recraw             `json:"recraw,omitempty" bigquery:"recraw,nullable"`
	Recshow        *Recshow            `json:"recshow,omitempty" bigquery:"recshow,nullable"`
	CreatedAt      time.Time           `json:"created_at" bigquery:"created_at"`
	IngestedAt     string              `json:"ingested_at" bigquery:"ingested_at"`
}

func (e *Event) Validate() error {
	if err := validation.StrNotEmpty(e.ID, "id is required"); err != nil {
		return fmt.Errorf("failed to validate id: %w", err)
	}
	if err := validation.StrNotEmpty(e.StoreId, "store_id is required"); err != nil {
		return fmt.Errorf("failed to validate store_id: %w", err)
	}
	if err := validation.StrNotEmpty(e.SessionId, "session_id is required"); err != nil {
		return fmt.Errorf("failed to validate session_id: %w", err)
	}
	if err := validation.False(e.CreatedAt.IsZero(), "created_at is required"); err != nil {
		return fmt.Errorf("failed to validate created_at: %w", err)
	}

	payloadCount := 0
	if e.Click != nil {
		payloadCount++
	}
	if e.AddToCart != nil {
		payloadCount++
	}
	if e.RemoveFromCart != nil {
		payloadCount++
	}
	if e.Search != nil {
		payloadCount++
	}
	if e.Purchase != nil {
		payloadCount++
	}
	if e.Recraw != nil {
		payloadCount++
	}
	if e.Recshow != nil {
		payloadCount++
	}

	if err := validation.Equal(1, payloadCount, "exactly one event payload (Click, AddToCart, RemoveFromCart, Search, Purchase, Recraw, Recshow) must be set"); err != nil {
		return fmt.Errorf("failed to validate event payload: %w", err)
	}

	if e.Click != nil {
		if err := e.Click.Validate(); err != nil {
			return fmt.Errorf("failed to validate click: %w", err)
		}
	}
	if e.AddToCart != nil {
		if err := e.AddToCart.Validate(); err != nil {
			return fmt.Errorf("failed to validate add_to_cart: %w", err)
		}
	}
	if e.RemoveFromCart != nil {
		if err := e.RemoveFromCart.Validate(); err != nil {
			return fmt.Errorf("failed to validate remove_from_cart: %w", err)
		}
	}
	if e.Search != nil {
		if err := e.Search.Validate(); err != nil {
			return fmt.Errorf("failed to validate search: %w", err)
		}
	}
	if e.Purchase != nil {
		if err := e.Purchase.Validate(); err != nil {
			return fmt.Errorf("failed to validate purchase: %w", err)
		}
	}
	if e.Recraw != nil {
		if err := e.Recraw.Validate(); err != nil {
			return fmt.Errorf("failed to validate recraw: %w", err)
		}
	}
	if e.Recshow != nil {
		if err := e.Recshow.Validate(); err != nil {
			return fmt.Errorf("failed to validate recshow: %w", err)
		}
	}
	return nil
}

func (c *Event) GetCreatedAt() *time.Time {
	return &c.CreatedAt
}

func (e *Event) Table() laketbnamez.TableName {
	return laketbnamez.MustParse("relevance-fashion-event")
}

func (e *Event) SetDataset(ds lakedsz.Dataset) {
	e.Dataset = tabledataz.NewBqNullString(ds.Get())
}

func (e *Event) SetIngestedAt(p string) {
	e.IngestedAt = p
}

type Click struct {
	Price float64 `json:"price" bigquery:"price"`
	SkuId string  `json:"sku_id" bigquery:"sku_id"`
}

func (u *Click) Validate() error {
	if err := validation.StrNotEmpty(u.SkuId, "sku_id is required"); err != nil {
		return fmt.Errorf("failed to validate sku_id: %w", err)
	}
	if err := validation.GreaterOrEqual(u.Price, 0.0, "price must be non-negative"); err != nil {
		return fmt.Errorf("failed to validate price: %w", err)
	}
	return nil
}

type AddToCart struct {
	Price float64 `json:"price" bigquery:"price"`
	SkuId string  `json:"sku_id" bigquery:"sku_id"`
}

func (u *AddToCart) Validate() error {
	if err := validation.StrNotEmpty(u.SkuId, "sku_id is required"); err != nil {
		return fmt.Errorf("failed to validate sku_id: %w", err)
	}
	if err := validation.GreaterOrEqual(u.Price, 0.0, "price must be non-negative"); err != nil {
		return fmt.Errorf("failed to validate price: %w", err)
	}
	return nil
}

type RemoveFromCart struct {
	Price float64 `json:"price" bigquery:"price"`
	SkuId string  `json:"sku_id" bigquery:"sku_id"`
}

func (u *RemoveFromCart) Validate() error {
	if err := validation.StrNotEmpty(u.SkuId, "sku_id is required"); err != nil {
		return fmt.Errorf("failed to validate sku_id: %w", err)
	}
	if err := validation.GreaterOrEqual(u.Price, 0.0, "price must be non-negative"); err != nil {
		return fmt.Errorf("failed to validate price: %w", err)
	}
	return nil
}

type Search struct {
	Text string `json:"text" bigquery:"text"`
}

func (u *Search) Validate() error {
	if err := validation.StrNotEmpty(u.Text, "text is required"); err != nil {
		return fmt.Errorf("failed to validate text: %w", err)
	}
	return nil
}

type Purchase struct {
	OrderId string         `json:"order_id" bigquery:"order_id"`
	Skus    []*PurchaseSku `json:"skus" bigquery:"skus"`
}

func (u *Purchase) Validate() error {
	if err := validation.StrNotEmpty(u.OrderId, "order_id is required"); err != nil {
		return fmt.Errorf("failed to validate order_id: %w", err)
	}
	if err := validation.NotEmpty(u.Skus, "skus must not be empty"); err != nil {
		return fmt.Errorf("failed to validate skus: %w", err)
	}
	for i, sku := range u.Skus {
		if sku == nil {
			return fmt.Errorf("failed to validate sku at index %d: sku cannot be nil", i)
		}
		if err := sku.Validate(); err != nil {
			return fmt.Errorf("failed to validate sku at index %d: %w", i, err)
		}
	}
	return nil
}

type PurchaseSku struct {
	SkuId     string  `json:"sku_id" bigquery:"sku_id"`
	Qtty      int64   `json:"qtty" bigquery:"qtty"`
	UnitPrice float64 `json:"unit_price" bigquery:"unit_price"`
}

func (u *PurchaseSku) Validate() error {
	if err := validation.StrNotEmpty(u.SkuId, "sku_id is required"); err != nil {
		return fmt.Errorf("failed to validate sku_id: %w", err)
	}
	if err := validation.GreaterOrEqual(u.UnitPrice, 0.0, "unit_price must be non-negative"); err != nil {
		return fmt.Errorf("failed to validate unit_price: %w", err)
	}
	if err := validation.Greater(u.Qtty, int64(0), "qtty must be greater than 0"); err != nil {
		return fmt.Errorf("failed to validate qtty: %w", err)
	}
	return nil
}

type Recraw struct {
	RecId        string `json:"rec_id" bigquery:"rec_id"`
	ModelId      string `json:"model_id" bigquery:"model_id"`
	ModelVersion string `json:"model_version" bigquery:"model_version"`
	Payload      string `json:"payload" bigquery:"payload"`
}

func (u *Recraw) Validate() error {
	if err := validation.StrNotEmpty(u.RecId, "rec_id is required"); err != nil {
		return fmt.Errorf("failed to validate rec_id: %w", err)
	}
	if err := validation.StrNotEmpty(u.ModelId, "model_id is required"); err != nil {
		return fmt.Errorf("failed to validate model_id: %w", err)
	}
	if err := validation.StrNotEmpty(u.Payload, "payload is required"); err != nil {
		return fmt.Errorf("failed to validate payload: %w", err)
	}
	return nil
}

type Recshow struct {
	RecId        string `json:"rec_id" bigquery:"rec_id"`
	ModelId      string `json:"model_id" bigquery:"model_id"`
	ModelVersion string `json:"model_version" bigquery:"model_version"`
	Payload      string `json:"payload" bigquery:"payload"`
}

func (u *Recshow) Validate() error {
	if err := validation.StrNotEmpty(u.RecId, "rec_id is required"); err != nil {
		return fmt.Errorf("failed to validate rec_id: %w", err)
	}
	if err := validation.StrNotEmpty(u.Payload, "payload is required"); err != nil {
		return fmt.Errorf("failed to validate payload: %w", err)
	}
	return nil
}

func (u *Click) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "Click event payload. SkuId is required; price must be non-negative.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"price": {
					Desc:  &schemaz.Desc{Summary: "Price of the clicked SKU (non-negative)."},
					Field: func() any { return &u.Price },
				},
				"sku_id": {
					Desc:  &schemaz.Desc{Summary: "SKU identifier (required)."},
					Field: func() any { return &u.SkuId },
				},
			}
		},
	}
}

func (u *AddToCart) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "AddToCart event payload. SkuId is required; price must be non-negative.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"price": {
					Desc:  &schemaz.Desc{Summary: "Price of the added SKU (non-negative)."},
					Field: func() any { return &u.Price },
				},
				"sku_id": {
					Desc:  &schemaz.Desc{Summary: "SKU identifier (required)."},
					Field: func() any { return &u.SkuId },
				},
			}
		},
	}
}

func (u *RemoveFromCart) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "RemoveFromCart event payload. SkuId is required; price must be non-negative.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"price": {
					Desc:  &schemaz.Desc{Summary: "Price of the removed SKU (non-negative)."},
					Field: func() any { return &u.Price },
				},
				"sku_id": {
					Desc:  &schemaz.Desc{Summary: "SKU identifier (required)."},
					Field: func() any { return &u.SkuId },
				},
			}
		},
	}
}

func (u *Search) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "Search event payload. Text is required.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"text": {
					Desc:  &schemaz.Desc{Summary: "Search query text (required)."},
					Field: func() any { return &u.Text },
				},
			}
		},
	}
}

func (u *PurchaseSku) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "PurchaseSku represents an individual item in a purchase. SkuId is required, unit_price must be non-negative, and qtty must be greater than 0.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"qtty": {
					Desc:  &schemaz.Desc{Summary: "Quantity of the purchased item (must be greater than 0)."},
					Field: func() any { return &u.Qtty },
				},
				"sku_id": {
					Desc:  &schemaz.Desc{Summary: "SKU identifier (required)."},
					Field: func() any { return &u.SkuId },
				},
				"unit_price": {
					Desc:  &schemaz.Desc{Summary: "Unit price of the item (non-negative)."},
					Field: func() any { return &u.UnitPrice },
				},
			}
		},
	}
}

func (u *Purchase) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "Purchase event payload. OrderId is required and skus must not be empty.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"order_id": {
					Desc:  &schemaz.Desc{Summary: "Order identifier (required)."},
					Field: func() any { return &u.OrderId },
				},
				"skus": {
					Desc: &schemaz.Desc{Summary: "List of purchased SKUs (must not be empty)."},
					Array: schemaz.NewArray(schemaz.ArrayOptions[[]*PurchaseSku, *PurchaseSku]{
						NewElement: func(idx int) *PurchaseSku { return &PurchaseSku{} },
						Slice:      func() *[]*PurchaseSku { return &u.Skus },
						Get:        func(idx int, element **PurchaseSku) *schemaz.Schema { return (*element).Schema() },
					}),
				},
			}
		},
	}
}

func (u *Recraw) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "Recraw event payload representing raw recommendations. RecId, ModelId, and Payload are required.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"rec_id": {
					Desc:  &schemaz.Desc{Summary: "Recommendation identifier (required)."},
					Field: func() any { return &u.RecId },
				},
				"model_id": {
					Desc:  &schemaz.Desc{Summary: "Model identifier (required)."},
					Field: func() any { return &u.ModelId },
				},
				"model_version": {
					Desc:  &schemaz.Desc{Summary: "Model version string."},
					Field: func() any { return &u.ModelVersion },
				},
				"payload": {
					Desc:  &schemaz.Desc{Summary: "Raw recommendation payload (required)."},
					Field: func() any { return &u.Payload },
				},
			}
		},
	}
}

func (u *Recshow) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "Recshow event payload representing displayed recommendations. RecId and Payload are required.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"rec_id": {
					Desc:  &schemaz.Desc{Summary: "Recommendation identifier (required)."},
					Field: func() any { return &u.RecId },
				},
				"model_id": {
					Desc:  &schemaz.Desc{Summary: "Model identifier."},
					Field: func() any { return &u.ModelId },
				},
				"model_version": {
					Desc:  &schemaz.Desc{Summary: "Model version string."},
					Field: func() any { return &u.ModelVersion },
				},
				"payload": {
					Desc:  &schemaz.Desc{Summary: "Displayed recommendation payload (required)."},
					Field: func() any { return &u.Payload },
				},
			}
		},
	}
}

func (e *Event) SchemaQuery() *schemaz.Schema {
	if e == nil {
		e = &Event{}
	}
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "Event represents an interaction in the Relevance Fashion domain. ID, StoreId, SessionId, and CreatedAt are required. Exactly one payload (Click, AddToCart, RemoveFromCart, Search, Purchase, Recraw, Recshow) must be set. Read-only fields like dataset and ingested_at are set by the system.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"id": {
					Desc:     &schemaz.Desc{Summary: "Unique identifier for the event (required)."},
					UrlValue: schemaz.ParseStr(&e.ID),
				},
				"store_id": {
					Desc:     &schemaz.Desc{Summary: "Identifier of the store (required)."},
					UrlValue: schemaz.ParseStr(&e.StoreId),
				},
				"session_id": {
					Desc:     &schemaz.Desc{Summary: "Identifier of the user session (required)."},
					UrlValue: schemaz.ParseStr(&e.SessionId),
				},
				"display_id": {
					Desc:     &schemaz.Desc{Summary: "Optional display identifier."},
					UrlValue: tabledataz.ParseBqNullString(&e.DisplayId),
				},
				"user_id": {
					Desc:     &schemaz.Desc{Summary: "Optional user identifier."},
					UrlValue: tabledataz.ParseBqNullString(&e.UserId),
				},
				"click": {
					Desc:     &schemaz.Desc{Summary: "Click event payload. Mutually exclusive with other payloads."},
					UrlValue: schemaz.ParseJson(&e.Click),
				},
				"add_to_cart": {
					Desc:     &schemaz.Desc{Summary: "AddToCart event payload. Mutually exclusive with other payloads."},
					UrlValue: schemaz.ParseJson(&e.AddToCart),
				},
				"remove_from_cart": {
					Desc:     &schemaz.Desc{Summary: "RemoveFromCart event payload. Mutually exclusive with other payloads."},
					UrlValue: schemaz.ParseJson(&e.RemoveFromCart),
				},
				"search": {
					Desc:     &schemaz.Desc{Summary: "Search event payload. Mutually exclusive with other payloads."},
					UrlValue: schemaz.ParseJson(&e.Search),
				},
				"purchase": {
					Desc:     &schemaz.Desc{Summary: "Purchase event payload. Mutually exclusive with other payloads."},
					UrlValue: schemaz.ParseJson(&e.Purchase),
				},
				"recraw": {
					Desc:     &schemaz.Desc{Summary: "Recraw event payload. Mutually exclusive with other payloads."},
					UrlValue: schemaz.ParseJson(&e.Recraw),
				},
				"recshow": {
					Desc:     &schemaz.Desc{Summary: "Recshow event payload. Mutually exclusive with other payloads."},
					UrlValue: schemaz.ParseJson(&e.Recshow),
				},
				"created_at": {
					Desc:     &schemaz.Desc{Summary: "Timestamp of event creation (required)."},
					UrlValue: tabledataz.ParseTime(&e.CreatedAt),
				},
			}
		},
	}
}

func (e *Event) SchemaBody() *schemaz.Schema {
	if e == nil {
		e = &Event{}
	}
	return &schemaz.Schema{
		Desc: &schemaz.Desc{
			Summary: "Event represents an interaction in the Relevance Fashion domain. ID, StoreId, SessionId, and CreatedAt are required. Exactly one payload (Click, AddToCart, RemoveFromCart, Search, Purchase, Recraw, Recshow) must be set. Read-only fields like dataset and ingested_at are set by the system.",
		},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"id": {
					Desc:  &schemaz.Desc{Summary: "Unique identifier for the event (required)."},
					Field: func() any { return &e.ID },
				},
				"store_id": {
					Desc:  &schemaz.Desc{Summary: "Identifier of the store (required)."},
					Field: func() any { return &e.StoreId },
				},
				"session_id": {
					Desc:  &schemaz.Desc{Summary: "Identifier of the user session (required)."},
					Field: func() any { return &e.SessionId },
				},
				"display_id": {
					Desc:  &schemaz.Desc{Summary: "Optional display identifier."},
					Field: func() any { return &e.DisplayId },
				},
				"user_id": {
					Desc:  &schemaz.Desc{Summary: "Optional user identifier."},
					Field: func() any { return &e.UserId },
				},
				"click": {
					Desc:  e.Click.Schema().Desc,
					Field: func() any { return &e.Click },
				},
				"add_to_cart": {
					Desc:  e.AddToCart.Schema().Desc,
					Field: func() any { return &e.AddToCart },
				},
				"remove_from_cart": {
					Desc:  e.RemoveFromCart.Schema().Desc,
					Field: func() any { return &e.RemoveFromCart },
				},
				"search": {
					Desc:  e.Search.Schema().Desc,
					Field: func() any { return &e.Search },
				},
				"purchase": {
					Desc:  e.Purchase.Schema().Desc,
					Field: func() any { return &e.Purchase },
				},
				"recraw": {
					Desc:  e.Recraw.Schema().Desc,
					Field: func() any { return &e.Recraw },
				},
				"recshow": {
					Desc:  e.Recshow.Schema().Desc,
					Field: func() any { return &e.Recshow },
				},
				"created_at": {
					Desc:  &schemaz.Desc{Summary: "Timestamp of event creation (required)."},
					Field: func() any { return &e.CreatedAt },
				},
			}
		},
	}
}
