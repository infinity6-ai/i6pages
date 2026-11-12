package storedisplayid_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/validation/checked/tuchecked"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/storedisplayid"
)

func TestUnitStoreDisplayIdChecked(t *testing.T) {
	tuchecked.Check(tuchecked.Table[*storedisplayid.StoreDisplayId, string]{
		Create: func(v string) *storedisplayid.StoreDisplayId {
			ret := storedisplayid.MustParse(v)
			return &ret
		},
		Valids:   []string{"display1", "display-123", "1display", "a1"},
		Invalids: []string{"display!", "display space", "a@b", "display.123", "display_xx", "UPPERdisplay", ""},
	})
}

func TestUnitStoreDisplayIdValidation(t *testing.T) {
	type testScenario struct {
		input  string
		want   string
		errMsg string
	}

	check := func(t *testing.T, s testScenario) {
		t.Helper()
		if s.errMsg != "" {
			require.Panics(t, func() {
				storedisplayid.MustParse(s.input)
			})
			return
		}
		got := storedisplayid.MustParse(s.input)
		require.Equal(t, s.want, got.String())
	}

	t.Run("Valid simple display id", func(t *testing.T) {
		check(t, testScenario{
			input: "display1",
			want:  "display1",
		})
	})

	t.Run("Display id with invalid characters returns error", func(t *testing.T) {
		check(t, testScenario{
			input:  "display_one",
			errMsg: "StoreDisplayId does not match displayIdValidator",
		})
	})
}
