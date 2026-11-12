package lakedsz_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/validation/checked/tuchecked"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
)

func TestUnitTableChecked(t *testing.T) {
	tuchecked.Check(tuchecked.Table[*lakedsz.Dataset, string]{
		Create: func(v string) *lakedsz.Dataset {
			ret := lakedsz.MustParse(v)
			return &ret
		},
		Valids:   []string{"a1a", "b-b", "c2c"},
		Invalids: []string{"", "a_a", "_1a", "a1_"},
	})
}
