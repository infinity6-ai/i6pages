package solution_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/validation/checked/tuchecked"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitSolutionChecked(t *testing.T) {
	tuchecked.Check(tuchecked.Table[*solution.Solution, string]{
		Create: func(v string) *solution.Solution {
			ret := solution.MustParse(v)
			return &ret
		},
		Valids:   []string{"relevance", "plat", "dummysolution"},
		Invalids: []string{"bla"},
	})
}

func TestUnitSolutionGetters(t *testing.T) {
	require.Equal(t, "relevance", solution.Relevance().Solution.Get())
	require.Equal(t, "plat", solution.Plat().Solution.Get())
	require.Equal(t, "dummysolution", solution.DummySolution().Solution.Get())

	require.Equal(t, solution.MustParse("relevance"), solution.Relevance().Solution)
	require.Equal(t, solution.MustParse("plat"), solution.Plat().Solution)
	require.Equal(t, solution.MustParse("dummysolution"), solution.DummySolution().Solution)
}
