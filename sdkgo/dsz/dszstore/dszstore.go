package dszstore

import (
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solutiondomain"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storedisplayid"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
)

type DszStore struct {
	Id              storeid.StoreId
	Name            string
	SolutionDomains []solutiondomain.SolutionDomain
}

func (dss *DszStore) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{Summary: "Store configuration object details."},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"id": {
					Desc:  &schemaz.Desc{Summary: "Unique identifier of the store."},
					Field: func() any { return &dss.Id },
				},
				"name": {
					Desc:  &schemaz.Desc{Summary: "Human-readable name of the store."},
					Field: func() any { return &dss.Name },
				},
				"solution_domains": {
					Desc: &schemaz.Desc{Summary: "Solution domains associated with this store."},
					Array: schemaz.NewArray(schemaz.ArrayOptions[[]solutiondomain.SolutionDomain, solutiondomain.SolutionDomain]{
						Slice: func() *[]solutiondomain.SolutionDomain { return &dss.SolutionDomains },
						Get: func(idx int, element *solutiondomain.SolutionDomain) *schemaz.Schema {
							return &schemaz.Schema{
								Desc:  &schemaz.Desc{Summary: "Solution domain association."},
								Field: func() any { return element },
							}
						},
					}),
				},
			}
		},
	}
}

type DszStoreDisplay struct {
	Id        storedisplayid.StoreDisplayId
	Name      string
	ModelName string
}
