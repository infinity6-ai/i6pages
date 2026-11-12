package lakedbz_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/validation/checked/tuchecked"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedbz"
)

func TestUnitTableChecked(t *testing.T) {
	tuchecked.Check(tuchecked.Table[*lakedbz.Database, string]{
		Create: func(v string) *lakedbz.Database {
			ret := lakedbz.MustParse(v)
			return &ret
		},
		Valids:   []string{"a1a", "b-b", "c2c"},
		Invalids: []string{"", "a_a", "_1a", "a1_"},
	})
}
