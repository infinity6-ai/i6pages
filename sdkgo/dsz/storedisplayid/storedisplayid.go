package storedisplayid

import (
	"regexp"

	"github.com/infinity6-ai/gox/commonz/constraintz/optionalz"
	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/validation"
	"github.com/infinity6-ai/gox/commonz/validation/checked"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
)

var displayIdValidator = regexp.MustCompile(`^[a-z0-9\-]+$`)

type StoreDisplayId checked.Value[string]

func (*StoreDisplayId) JSType() string {
	return jstypez.TypString
}

func (d StoreDisplayId) Optional() optionalz.Optional[string] {
	return checked.Value[string](d).Optional()
}

func (d StoreDisplayId) Get() string {
	return checked.Value[string](d).Get()
}

func (d StoreDisplayId) String() string {
	return d.Get()
}

func (d StoreDisplayId) MarshalJSON() ([]byte, error) {
	return checked.Marshal[string](d)
}

func (d *StoreDisplayId) UnmarshalJSON(data []byte) error {
	return checked.Unmarshal(d, data)
}

func (d StoreDisplayId) Validate(v string) error {
	if err := validation.RegexMatch(displayIdValidator, v, "StoreDisplayId"); err != nil {
		return err
	}
	return nil
}

func MustParse(id string) StoreDisplayId {
	var ret StoreDisplayId
	err := checked.Set(&ret, id)
	errorz.Check(err)
	return ret
}
