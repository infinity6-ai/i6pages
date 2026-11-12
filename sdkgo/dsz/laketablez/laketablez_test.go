package laketablez_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/infinity6-ai/gox/commonz/validation/checked/tuchecked"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedbz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketablez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbnamez"
)

func TestUnitChecked(t *testing.T) {
	tuchecked.Check(tuchecked.Table[*laketablez.Table, laketablez.Value]{
		Create: func(v laketablez.Value) *laketablez.Table {
			ret := laketablez.MustParse(v)
			return &ret
		},
		Valids:   []laketablez.Value{{Database: lakedbz.MustParse("aaa"), Name: laketbnamez.MustParse("bbb")}},
		Invalids: []laketablez.Value{{}},
	})
}

func TestUnitJson(t *testing.T) {
	require.Equal(t, "\"aaa.bbb\"", jsonz.MustFormat(laketablez.MustParse(laketablez.Value{Database: lakedbz.MustParse("aaa"), Name: laketbnamez.MustParse("bbb")})).String())

	require.Panics(t, func() {
		jsonz.MustFormat(new(laketablez.Table))
	})
}

func TestUnitMutabilty(t *testing.T) {
	tb := laketablez.MustParse(laketablez.Value{
		Database: lakedbz.MustParse("aaa"),
		Name:     laketbnamez.MustParse("bbb"),
	})
	x := tb.Get()
	x.Database = lakedbz.MustParse("ccc")
	require.Equal(t, "ccc.bbb", x.String())
	require.Equal(t, "aaa.bbb", tb.Get().String())
}
