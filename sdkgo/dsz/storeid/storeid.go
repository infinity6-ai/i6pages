package storeid

import (
	"regexp"

	"github.com/infinity6-ai/gox/commonz/constraintz/optionalz"
	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/validation"
	"github.com/infinity6-ai/gox/commonz/validation/checked"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
)

var storeIdValidator = regexp.MustCompile(`^[a-z0-9\-]+$`)

type StoreId checked.Value[string]

func (*StoreId) JSType() string {
	return jstypez.TypString
}

func (d StoreId) Optional() optionalz.Optional[string] {
	return checked.Value[string](d).Optional()
}

func (d StoreId) Get() string {
	return checked.Value[string](d).Get()
}

func (d StoreId) String() string {
	return d.Get()
}

func (d StoreId) MarshalJSON() ([]byte, error) {
	return checked.Marshal[string](d)
}

func (d *StoreId) UnmarshalJSON(data []byte) error {
	return checked.Unmarshal(d, data)
}

func (d StoreId) Validate(v string) error {
	if err := validation.RegexMatch(storeIdValidator, v, "StoreId"); err != nil {
		return err
	}
	return nil
}

func MustParse(id string) StoreId {
	var ret StoreId
	err := checked.Set(&ret, id)
	errorz.Check(err)
	return ret
}
