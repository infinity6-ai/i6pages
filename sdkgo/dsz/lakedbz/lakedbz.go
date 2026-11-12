package lakedbz

import (
	"regexp"

	"github.com/infinity6-ai/gox/commonz/constraintz/optionalz"
	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/validation"
	"github.com/infinity6-ai/gox/commonz/validation/checked"
)

var validator = regexp.MustCompile(`^[a-z][a-z0-9\-]{1,}[a-z0-9]$`)

type Database checked.Value[string]

func (d Database) Optional() optionalz.Optional[string] {
	return checked.Value[string](d).Optional()
}

func (d Database) Get() string {
	return checked.Value[string](d).Get()
}

func (d Database) String() string {
	return d.Get()
}

func (d Database) MarshalJSON() ([]byte, error) {
	return checked.Marshal[string](d)
}

func (d *Database) UnmarshalJSON(data []byte) error {
	return checked.Unmarshal(d, data)
}

func (d Database) Validate(v string) error {
	if err := validation.StrNotEmpty(v, "TableId cannot be empty"); err != nil {
		return err
	}
	if err := validation.RegexMatch(validator, v, "TableId"); err != nil {
		return err
	}
	return nil
}

func Parse(name string) (Database, error) {
	var ret Database
	err := checked.Set(&ret, name)
	return ret, err
}

func MustParse(name string) Database {
	ret, err := Parse(name)
	errorz.Check(err)
	return ret
}
