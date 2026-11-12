package solutiondomain_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/infinity6-ai/gox/commonz/validation/checked/tuchecked"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/domain"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solutiondomain"
)

func TestUnitChecked(t *testing.T) {
	tuchecked.Check(tuchecked.Table[*solutiondomain.SolutionDomain, solutiondomain.Value]{
		Create: func(v solutiondomain.Value) *solutiondomain.SolutionDomain {
			ret := solutiondomain.MustParse(v)
			return &ret
		},
		Valids:   []solutiondomain.Value{{Solution: solution.Relevance().Solution, Domain: domain.MustParse("fashion")}},
		Invalids: []solutiondomain.Value{{}},
	})
}

func TestUnitJson(t *testing.T) {
	require.Equal(t, "\"relevance_fashion\"", jsonz.MustFormat(solutiondomain.MustParse(solutiondomain.Value{Solution: solution.Relevance().Solution, Domain: domain.MustParse("fashion")})).String())

	require.Panics(t, func() {
		jsonz.MustFormat(new(solutiondomain.SolutionDomain))
	})
}

func TestUnitMutabilty(t *testing.T) {
	tb := solutiondomain.MustParse(solutiondomain.Value{
		Solution: solution.Relevance().Solution,
		Domain:   domain.MustParse("fashion"),
	})
	x := tb.Get()
	x.Solution = solution.DummySolution().Solution
	require.Equal(t, "dummysolution_fashion", x.String())
	require.Equal(t, "relevance_fashion", tb.Get().String())
}
