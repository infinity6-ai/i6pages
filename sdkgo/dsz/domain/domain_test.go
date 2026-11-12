package domain_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/validation/checked/tuchecked"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/domain"
)

func TestUnitDomainChecked(t *testing.T) {
	tuchecked.Check(tuchecked.Table[*domain.Domain, string]{
		Create: func(v string) *domain.Domain {
			ret := domain.MustParse(v)
			return &ret
		},
		Valids:   []string{"fashion"},
		Invalids: []string{"bla"},
	})
}
