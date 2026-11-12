package laketbpathz_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/validation/checked/tuchecked"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbpathz"
)

func TestUnitTableChecked(t *testing.T) {
	tuchecked.Check(tuchecked.Table[*laketbpathz.Path, string]{
		Create: func(v string) *laketbpathz.Path {
			ret := laketbpathz.MustParse(v)
			return &ret
		},
		Valids:   []string{"i6tb://bla.ble/a=2/b=x/my/file.txt", "i6tb://bla.ble/my/file.txt", "i6tb://bla.ble/a=2/b=x", "i6tb://bla.ble", "i6tb://bla.ble/"},
		Invalids: []string{"", "a_a", "_1a", "a1_", "i6tb://bla/", "i6tb://bla", "i6tb://", "i6tb://bla.", "i6tb://.ble", "i6tb://."},
	})
}
