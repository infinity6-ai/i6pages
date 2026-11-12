package lakedspathz_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/validation/checked/tuchecked"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedspathz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbpathz"
)

func TestUnitTableChecked(t *testing.T) {
	tuchecked.Check(tuchecked.Table[*lakedspathz.Path, string]{
		Create: func(v string) *lakedspathz.Path {
			ret := lakedspathz.MustParse(v)
			return &ret
		},
		Valids: []string{
			"i6ds://mydataset/bla.ble/a=2/b=x/my/file.txt",
			"i6ds://mydataset/bla.ble/my/file.txt",
			"i6ds://mydataset/bla.ble/a=2/b=x",
			"i6ds://mydataset/bla.ble",
			"i6ds://mydataset/bla.ble/",
		},
		Invalids: []string{
			"", "a_a", "_1a", "a1_",
			"i6ds://mydataset/bla/", "i6ds://mydataset/bla",
			"i6ds://mydataset", "i6ds://mydataset/",
			"i6ds://", "i6ds://mydataset/bla.", "i6ds://mydataset/.ble", "i6ds://mydataset/.",
		},
	})
}

func TestUnitTablePath(t *testing.T) {
	type testScenario struct {
		ds   lakedsz.Dataset
		tp   laketbpathz.ParsedPath
		want lakedspathz.Path
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()
		got := lakedspathz.TablePath(s.ds, s.tp)
		require.Equal(t, s.want, got)
	}

	ds := lakedsz.MustParse("mydataset")

	t.Run("full path with partitions and file", func(t *testing.T) {
		check(t, testScenario{
			ds:   ds,
			tp:   laketbpathz.MustParse("i6tb://bla.ble/a=2/b=x/my/file.txt").MustParse(),
			want: lakedspathz.MustParse("i6ds://mydataset/bla.ble/a=2/b=x/my/file.txt"),
		})
	})

	t.Run("path without partitions", func(t *testing.T) {
		check(t, testScenario{
			ds:   ds,
			tp:   laketbpathz.MustParse("i6tb://bla.ble/my/file.txt").MustParse(),
			want: lakedspathz.MustParse("i6ds://mydataset/bla.ble/my/file.txt"),
		})
	})

	t.Run("path without file", func(t *testing.T) {
		check(t, testScenario{
			ds:   ds,
			tp:   laketbpathz.MustParse("i6tb://bla.ble/a=2/b=x").MustParse(),
			want: lakedspathz.MustParse("i6ds://mydataset/bla.ble/a=2/b=x/"),
		})
	})

	t.Run("table only", func(t *testing.T) {
		check(t, testScenario{
			ds:   ds,
			tp:   laketbpathz.MustParse("i6tb://bla.ble").MustParse(),
			want: lakedspathz.MustParse("i6ds://mydataset/bla.ble/"),
		})
	})
}
