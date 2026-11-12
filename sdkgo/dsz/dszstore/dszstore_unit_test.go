package dszstore_test

import (
	"testing"

	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparser"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/domain"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/dszstore"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solutiondomain"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storeid"
)

func TestUnitDszStoreSchema(t *testing.T) {
	ctx := t.Context()

	store := &dszstore.DszStore{
		Id:   storeid.MustParse("my-store"),
		Name: "My Awesome Store",
		SolutionDomains: []solutiondomain.SolutionDomain{
			solutiondomain.MustParse(solutiondomain.Value{
				Solution: solution.Relevance().Solution,
				Domain:   domain.MustParse("fashion"),
			}),
		},
	}

	schema := store.Schema()
	require.NotNil(t, schema)

	td, tds := jsparser.ParseSchema(ctx, "dszStore", schema)
	require.NotNil(t, td)
	require.NotNil(t, tds)

	// Verify the properties of the parsed schema
	props := td.Properties.All()
	require.Len(t, props, 3)

	var hasId, hasName, hasSolutionDomains bool
	for _, prop := range props {
		switch prop.Name {
		case "id":
			hasId = true
			require.Equal(t, "string", prop.Typ)
		case "name":
			hasName = true
			require.Equal(t, "string", prop.Typ)
		case "solution_domains":
			hasSolutionDomains = true
			require.Equal(t, "Array<dszStoreSolutionDomainsElement>", prop.Typ)
		}
	}

	require.True(t, hasId, "schema must contain 'id' field")
	require.True(t, hasName, "schema must contain 'name' field")
	require.True(t, hasSolutionDomains, "schema must contain 'solution_domains' field")

	// Verify that the array element type is also defined and of type string
	var foundElement bool
	for _, typedef := range tds.All() {
		if typedef.Head.Name == "dszStoreSolutionDomainsElement" {
			foundElement = true
			require.Equal(t, "string", typedef.Head.Typ)
		}
	}
	require.True(t, foundElement, "typedefs must define the element type 'dszStoreSolutionDomainsElement'")
}
