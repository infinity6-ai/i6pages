package domain

import (
	"github.com/infinity6-ai/gox/commonz/constraintz/optionalz"
	"github.com/infinity6-ai/gox/commonz/validation"
	"github.com/infinity6-ai/gox/commonz/validation/checked"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
)

type Domain checked.Value[string]

func (*Domain) JSType() string {
	return jstypez.TypString
}

func (d Domain) Optional() optionalz.Optional[string] {
	return checked.Value[string](d).Optional()
}

func (d Domain) Get() string {
	return checked.Value[string](d).Get()
}

func (d Domain) String() string {
	return d.Get()
}

func (d Domain) MarshalJSON() ([]byte, error) {
	return checked.Marshal[string](d)
}

func (d *Domain) UnmarshalJSON(data []byte) error {
	return checked.Unmarshal(d, data)
}

func (d Domain) Validate(v string) error {
	if err := validation.StrNotEmpty(v, "Domain cannot be empty"); err != nil {
		return err
	}
	if err := validation.OneOf([]string{"fashion", "plat", "dummydomain"}, v, "Domain"); err != nil {
		return err
	}
	return nil
}

func MustParse(id string) Domain {
	var ret Domain
	checked.MustSet(&ret, id)
	return ret
}

func ParseStr(out *Domain) func() *schemaz.Parser[string] {
	return func() *schemaz.Parser[string] {
		return &schemaz.Parser[string]{
			Parse: func(v string) {
				*out = MustParse(v)
			},
			Format: func() (string, any) {
				return out.Get(), *out
			},
		}
	}
}
