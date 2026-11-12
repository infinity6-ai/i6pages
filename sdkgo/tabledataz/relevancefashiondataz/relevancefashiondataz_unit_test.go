package relevancefashiondataz_test

import (
	"encoding/json"
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparser"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/tabledataz"
	"go.code.infinity6.ai/sdkgo/sdkgo/tabledataz/relevancefashiondataz"
)

var (
	_ tabledataz.TableData = (*relevancefashiondataz.Catalog)(nil)
	_ tabledataz.TableData = (*relevancefashiondataz.Event)(nil)
)

func TestUnitEventSerialization(t *testing.T) {
	type testScenario struct {
		jsonStr string
		event   relevancefashiondataz.Event
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()

		// Test Deserialization (JSON -> Struct)
		var got relevancefashiondataz.Event
		err := json.Unmarshal([]byte(s.jsonStr), &got)
		require.NoError(t, err)

		// Assert that the timestamp matches within a second (to avoid minor format/timezone differences in string serialization)
		require.WithinDuration(t, s.event.CreatedAt, got.CreatedAt, time.Second)

		// Align CreatedAt exactly to perform exact field value checks
		got.CreatedAt = s.event.CreatedAt
		require.Equal(t, s.event, got)

		// Test Serialization (Struct -> JSON -> Struct)
		serialized, err := json.Marshal(s.event)
		require.NoError(t, err)

		var roundTrip relevancefashiondataz.Event
		err = json.Unmarshal(serialized, &roundTrip)
		require.NoError(t, err)

		roundTrip.CreatedAt = s.event.CreatedAt
		require.Equal(t, s.event, roundTrip)
	}

	t.Run("Basic event fields", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "evt_123",
				"store_id": "ABC",
				"session_id": "sess_456",
				"user_id": "usr_789",
				"created_at": "2026-10-08T12:00:00Z"
			}`,
			event: relevancefashiondataz.Event{
				ID:        "evt_123",
				StoreId:   "ABC",
				SessionId: "sess_456",
				UserId:    tabledataz.NewBqNullString("usr_789"),
				CreatedAt: time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
			},
		})
	})

	t.Run("Click event payload", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "evt_123",
				"store_id": "ABC",
				"session_id": "sess_456",
				"user_id": "usr_789",
				"created_at": "2026-10-08T12:00:00Z",
				"click": {
					"price": 166.4,
					"sku_id": "146"
				}
			}`,
			event: relevancefashiondataz.Event{
				ID:        "evt_123",
				StoreId:   "ABC",
				SessionId: "sess_456",
				UserId:    tabledataz.NewBqNullString("usr_789"),
				CreatedAt: time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
				Click: &relevancefashiondataz.Click{
					Price: 166.4,
					SkuId: "146",
				},
			},
		})
	})

	t.Run("AddToCart event payload", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "evt_123",
				"store_id": "ABC",
				"session_id": "sess_456",
				"user_id": "usr_789",
				"created_at": "2026-10-08T12:00:00Z",
				"add_to_cart": {
					"price": 166.42,
					"sku_id": "121"
				}
			}`,
			event: relevancefashiondataz.Event{
				ID:        "evt_123",
				StoreId:   "ABC",
				SessionId: "sess_456",
				UserId:    tabledataz.NewBqNullString("usr_789"),
				CreatedAt: time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
				AddToCart: &relevancefashiondataz.AddToCart{
					Price: 166.42,
					SkuId: "121",
				},
			},
		})
	})

	t.Run("RemoveFromCart event payload", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "evt_123",
				"store_id": "ABC",
				"session_id": "sess_456",
				"user_id": "usr_789",
				"created_at": "2026-10-08T12:00:00Z",
				"remove_from_cart": {
					"price": 61.81,
					"sku_id": "113"
				}
			}`,
			event: relevancefashiondataz.Event{
				ID:        "evt_123",
				StoreId:   "ABC",
				SessionId: "sess_456",
				UserId:    tabledataz.NewBqNullString("usr_789"),
				CreatedAt: time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
				RemoveFromCart: &relevancefashiondataz.RemoveFromCart{
					Price: 61.81,
					SkuId: "113",
				},
			},
		})
	})

	t.Run("Search event payload", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "evt_123",
				"store_id": "ABC",
				"session_id": "sess_456",
				"user_id": "usr_789",
				"created_at": "2026-10-08T12:00:00Z",
				"search": {
					"text": "camisa da barbie"
				}
			}`,
			event: relevancefashiondataz.Event{
				ID:        "evt_123",
				StoreId:   "ABC",
				SessionId: "sess_456",
				UserId:    tabledataz.NewBqNullString("usr_789"),
				CreatedAt: time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
				Search: &relevancefashiondataz.Search{
					Text: "camisa da barbie",
				},
			},
		})
	})

	t.Run("Purchase event payload", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "evt_123",
				"store_id": "ABC",
				"session_id": "sess_456",
				"user_id": "usr_789",
				"created_at": "2026-10-08T12:00:00Z",
				"purchase": {
					"order_id": "8e37896a-7669-48b7-95fb-a661d6a1e597",
					"skus": [
						{
							"qtty": 1,
							"sku_id": "164",
							"unit_price": 259.29
						}
					]
				}
			}`,
			event: relevancefashiondataz.Event{
				ID:        "evt_123",
				StoreId:   "ABC",
				SessionId: "sess_456",
				UserId:    tabledataz.NewBqNullString("usr_789"),
				CreatedAt: time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
				Purchase: &relevancefashiondataz.Purchase{
					OrderId: "8e37896a-7669-48b7-95fb-a661d6a1e597",
					Skus: []*relevancefashiondataz.PurchaseSku{
						{
							Qtty:      1,
							SkuId:     "164",
							UnitPrice: 259.29,
						},
					},
				},
			},
		})
	})

	t.Run("Recraw event payload", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "evt_123",
				"store_id": "ABC",
				"session_id": "sess_456",
				"user_id": "usr_789",
				"created_at": "2026-10-08T12:00:00Z",
				"recraw": {
					"rec_id": "xpto",
					"model_id": "relevance-fashion-fbt",
					"payload": "{\"results\":[{\"skus\":[{\"sku_id\":\"28\"}],\"rating\":0.0726400166749954}]}"
				}
			}`,
			event: relevancefashiondataz.Event{
				ID:        "evt_123",
				StoreId:   "ABC",
				SessionId: "sess_456",
				UserId:    tabledataz.NewBqNullString("usr_789"),
				CreatedAt: time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
				Recraw: &relevancefashiondataz.Recraw{
					RecId:   "xpto",
					ModelId: "relevance-fashion-fbt",
					Payload: `{"results":[{"skus":[{"sku_id":"28"}],"rating":0.0726400166749954}]}`,
				},
			},
		})
	})

	t.Run("Recshow event payload", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "evt_123",
				"store_id": "ABC",
				"session_id": "sess_456",
				"user_id": "usr_789",
				"created_at": "2026-10-08T12:00:00Z",
				"recshow": {
					"rec_id": "xpto",
					"payload": "{\"skus\":[{\"sku_id\":\"107\"}]}"
				}
			}`,
			event: relevancefashiondataz.Event{
				ID:        "evt_123",
				StoreId:   "ABC",
				SessionId: "sess_456",
				UserId:    tabledataz.NewBqNullString("usr_789"),
				CreatedAt: time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
				Recshow: &relevancefashiondataz.Recshow{
					RecId:   "xpto",
					Payload: `{"skus":[{"sku_id":"107"}]}`,
				},
			},
		})
	})

	t.Run("Event fields with optional property P", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "evt_123",
				"store_id": "ABC",
				"session_id": "sess_456",
				"user_id": "usr_789",
				"created_at": "2026-10-08T12:00:00Z",
				"ingested_at": "custom_param"
			}`,
			event: relevancefashiondataz.Event{
				ID:         "evt_123",
				StoreId:    "ABC",
				SessionId:  "sess_456",
				UserId:     tabledataz.NewBqNullString("usr_789"),
				CreatedAt:  time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
				IngestedAt: "custom_param",
			},
		})
	})
}

func TestUnitEventSchema(t *testing.T) {
	ctx := t.Context()
	t.Run("Click Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.Click{}).Schema()
		td, _ := jsparser.ParseSchema(ctx, "Click", s)
		require.Equal(t, "Click", td.Head.Name)
	})
	t.Run("AddToCart Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.AddToCart{}).Schema()
		td, _ := jsparser.ParseSchema(ctx, "AddToCart", s)
		require.Equal(t, "AddToCart", td.Head.Name)
	})
	t.Run("RemoveFromCart Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.RemoveFromCart{}).Schema()
		td, _ := jsparser.ParseSchema(ctx, "RemoveFromCart", s)
		require.Equal(t, "RemoveFromCart", td.Head.Name)
	})
	t.Run("Search Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.Search{}).Schema()
		td, _ := jsparser.ParseSchema(ctx, "Search", s)
		require.Equal(t, "Search", td.Head.Name)
	})
	t.Run("PurchaseSku Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.PurchaseSku{}).Schema()
		td, _ := jsparser.ParseSchema(ctx, "PurchaseSku", s)
		require.Equal(t, "PurchaseSku", td.Head.Name)
	})
	t.Run("Purchase Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.Purchase{}).Schema()
		td, _ := jsparser.ParseSchema(ctx, "Purchase", s)
		require.Equal(t, "Purchase", td.Head.Name)
	})
	t.Run("Recraw Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.Recraw{}).Schema()
		td, _ := jsparser.ParseSchema(ctx, "Recraw", s)
		require.Equal(t, "Recraw", td.Head.Name)
	})
	t.Run("Recshow Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.Recshow{}).Schema()
		td, _ := jsparser.ParseSchema(ctx, "Recshow", s)
		require.Equal(t, "Recshow", td.Head.Name)
	})
	t.Run("Event Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.Event{}).SchemaQuery()
		td, tds := jsparser.ParseSchema(ctx, "Event", s)
		require.Equal(t, "Event", td.Head.Name)

		propMap := make(map[string]jstypez.Tuple)
		for _, prop := range td.Properties.All() {
			propMap[prop.Name] = prop
		}

		require.Contains(t, propMap, "id")
		require.Equal(t, "string", propMap["id"].Typ)

		require.Contains(t, propMap, "created_at")
		require.Equal(t, jstypez.TypTime, propMap["created_at"].Typ)

		require.Contains(t, propMap, "click")
		require.Equal(t, "EventClick", propMap["click"].Typ)

		require.Contains(t, propMap, "purchase")
		require.Equal(t, "EventPurchase", propMap["purchase"].Typ)

		// Check registered sub-typedefs
		tdfMap := make(map[string]*jstypez.Typedef)
		for _, tdf := range tds.All() {
			tdfMap[tdf.Head.Name] = tdf
		}

		require.Contains(t, tdfMap, "EventClick")
		require.Contains(t, tdfMap, "EventPurchase")
		require.Contains(t, tdfMap, "EventPurchaseSkusElement")
	})
}

func TestUnitCatalogSerialization(t *testing.T) {
	type testScenario struct {
		jsonStr string
		catalog relevancefashiondataz.Catalog
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()

		// Test Deserialization (JSON -> Struct)
		var got relevancefashiondataz.Catalog
		err := json.Unmarshal([]byte(s.jsonStr), &got)
		require.NoError(t, err)
		require.Equal(t, s.catalog, got)

		// Test Serialization (Struct -> JSON -> Struct)
		serialized, err := json.Marshal(s.catalog)
		require.NoError(t, err)

		var roundTrip relevancefashiondataz.Catalog
		err = json.Unmarshal(serialized, &roundTrip)
		require.NoError(t, err)
		require.Equal(t, s.catalog, roundTrip)
	}

	t.Run("Basic catalog fields", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "cat_123",
				"store_id": "ABC",
				"product_id": "prod_456",
				"sku_id": "sku_789",
				"sku_ds": "sku description",
				"inactive": false
			}`,
			catalog: relevancefashiondataz.Catalog{
				ID:        "cat_123",
				StoreId:   "ABC",
				ProductId: "prod_456",
				SkuId:     "sku_789",
				SkuDs:     "sku description",
				Inactive:  false,
			},
		})
	})

	t.Run("Inactive catalog item", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "cat_456",
				"store_id": "XYZ",
				"product_id": "prod_789",
				"sku_id": "sku_012",
				"sku_ds": "another description",
				"inactive": true
			}`,
			catalog: relevancefashiondataz.Catalog{
				ID:        "cat_456",
				StoreId:   "XYZ",
				ProductId: "prod_789",
				SkuId:     "sku_012",
				SkuDs:     "another description",
				Inactive:  true,
			},
		})
	})

	t.Run("Catalog fields with optional property P", func(t *testing.T) {
		check(t, testScenario{
			jsonStr: `{
				"id": "cat_123",
				"store_id": "ABC",
				"product_id": "prod_456",
				"sku_id": "sku_789",
				"sku_ds": "sku description",
				"inactive": false,
				"ingested_at": "custom_param_catalog"
			}`,
			catalog: relevancefashiondataz.Catalog{
				ID:         "cat_123",
				StoreId:    "ABC",
				ProductId:  "prod_456",
				SkuId:      "sku_789",
				SkuDs:      "sku description",
				Inactive:   false,
				IngestedAt: "custom_param_catalog",
			},
		})
	})
}

func TestUnitCatalogSchema(t *testing.T) {
	ctx := t.Context()
	t.Run("Catalog Schema", func(t *testing.T) {
		s := (&relevancefashiondataz.Catalog{}).SchemaQuery()
		td, _ := jsparser.ParseSchema(ctx, "Catalog", s)
		require.Equal(t, "Catalog", td.Head.Name)

		propMap := make(map[string]jstypez.Tuple)
		for _, prop := range td.Properties.All() {
			propMap[prop.Name] = prop
		}

		require.Contains(t, propMap, "id")
		require.Equal(t, "string", propMap["id"].Typ)

		require.Contains(t, propMap, "store_id")
		require.Equal(t, "string", propMap["store_id"].Typ)

		require.Contains(t, propMap, "product_id")
		require.Equal(t, "string", propMap["product_id"].Typ)

		require.Contains(t, propMap, "sku_id")
		require.Equal(t, "string", propMap["sku_id"].Typ)

		require.Contains(t, propMap, "sku_ds")
		require.Equal(t, "string", propMap["sku_ds"].Typ)

		require.Contains(t, propMap, "inactive")
		require.Equal(t, "boolean", propMap["inactive"].Typ)
	})
}

func TestUnitEventValidation(t *testing.T) {
	validBaseEvent := func() relevancefashiondataz.Event {
		return relevancefashiondataz.Event{
			ID:        "evt_123",
			StoreId:   "store_abc",
			SessionId: "sess_xyz",
			CreatedAt: time.Date(2026, 10, 8, 12, 0, 0, 0, time.UTC),
		}
	}

	type testScenario struct {
		event  relevancefashiondataz.Event
		errMsg string
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()
		err := s.event.Validate()
		if s.errMsg != "" {
			require.Error(t, err)
			require.Contains(t, err.Error(), s.errMsg)
			return
		}
		require.NoError(t, err)
	}

	t.Run("Valid event with Click only", func(t *testing.T) {
		evt := validBaseEvent()
		evt.Click = &relevancefashiondataz.Click{Price: 10.5, SkuId: "sku_1"}
		check(t, testScenario{event: evt})
	})

	t.Run("Valid event with AddToCart only", func(t *testing.T) {
		evt := validBaseEvent()
		evt.AddToCart = &relevancefashiondataz.AddToCart{Price: 20.0, SkuId: "sku_2"}
		check(t, testScenario{event: evt})
	})

	t.Run("Valid event with RemoveFromCart only", func(t *testing.T) {
		evt := validBaseEvent()
		evt.RemoveFromCart = &relevancefashiondataz.RemoveFromCart{Price: 15.0, SkuId: "sku_3"}
		check(t, testScenario{event: evt})
	})

	t.Run("Valid event with Search only", func(t *testing.T) {
		evt := validBaseEvent()
		evt.Search = &relevancefashiondataz.Search{Text: "shoes"}
		check(t, testScenario{event: evt})
	})

	t.Run("Valid event with Purchase only", func(t *testing.T) {
		evt := validBaseEvent()
		evt.Purchase = &relevancefashiondataz.Purchase{
			OrderId: "ord_1",
			Skus: []*relevancefashiondataz.PurchaseSku{
				{SkuId: "sku_1", UnitPrice: 10.0, Qtty: 1},
			},
		}
		check(t, testScenario{event: evt})
	})

	t.Run("Valid event with Recraw only", func(t *testing.T) {
		evt := validBaseEvent()
		evt.Recraw = &relevancefashiondataz.Recraw{
			RecId:   "rec_1",
			ModelId: "model_a",
			Payload: "{}",
		}
		check(t, testScenario{event: evt})
	})

	t.Run("Valid event with Recshow only", func(t *testing.T) {
		evt := validBaseEvent()
		evt.Recshow = &relevancefashiondataz.Recshow{
			RecId:   "rec_2",
			Payload: "{}",
		}
		check(t, testScenario{event: evt})
	})

	t.Run("Invalid: No payload set", func(t *testing.T) {
		evt := validBaseEvent()
		check(t, testScenario{
			event:  evt,
			errMsg: "failed to validate event payload",
		})
	})

	t.Run("Invalid: Multiple payloads set (Click and AddToCart)", func(t *testing.T) {
		evt := validBaseEvent()
		evt.Click = &relevancefashiondataz.Click{Price: 10.5, SkuId: "sku_1"}
		evt.AddToCart = &relevancefashiondataz.AddToCart{Price: 20.0, SkuId: "sku_2"}
		check(t, testScenario{
			event:  evt,
			errMsg: "failed to validate event payload",
		})
	})

	t.Run("Invalid: Multiple payloads set (Purchase and Search)", func(t *testing.T) {
		evt := validBaseEvent()
		evt.Search = &relevancefashiondataz.Search{Text: "shoes"}
		evt.Purchase = &relevancefashiondataz.Purchase{
			OrderId: "ord_1",
			Skus: []*relevancefashiondataz.PurchaseSku{
				{SkuId: "sku_1", UnitPrice: 10.0, Qtty: 1},
			},
		}
		check(t, testScenario{
			event:  evt,
			errMsg: "failed to validate event payload",
		})
	})

	t.Run("Invalid: Missing ID", func(t *testing.T) {
		evt := validBaseEvent()
		evt.ID = ""
		evt.Click = &relevancefashiondataz.Click{Price: 10.5, SkuId: "sku_1"}
		check(t, testScenario{
			event:  evt,
			errMsg: "failed to validate id",
		})
	})

	t.Run("Invalid: Invalid nested Click payload (missing SkuId)", func(t *testing.T) {
		evt := validBaseEvent()
		evt.Click = &relevancefashiondataz.Click{Price: 10.5, SkuId: ""}
		check(t, testScenario{
			event:  evt,
			errMsg: "failed to validate click",
		})
	})
}
