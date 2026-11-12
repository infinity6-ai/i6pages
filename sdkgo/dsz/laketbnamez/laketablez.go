package laketbnamez

import (
	"regexp"

	"github.com/infinity6-ai/gox/commonz/constraintz/optionalz"
	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/validation"
	"github.com/infinity6-ai/gox/commonz/validation/checked"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
)

var validator = regexp.MustCompile(`^[a-z][a-z0-9\-]{1,}[a-z0-9]$`)

type TableName checked.Value[string]

func (*TableName) JSType() string {
	return jstypez.TypString
}

func (d TableName) Optional() optionalz.Optional[string] {
	return checked.Value[string](d).Optional()
}

func (d TableName) Get() string {
	return checked.Value[string](d).Get()
}

func (d TableName) String() string {
	return d.Get()
}

func (d TableName) MarshalJSON() ([]byte, error) {
	return checked.Marshal[string](d)
}

func (d *TableName) UnmarshalJSON(data []byte) error {
	return checked.Unmarshal(d, data)
}

func (d TableName) Validate(v string) error {
	if err := validation.StrNotEmpty(v, "TableId cannot be empty"); err != nil {
		return err
	}
	if err := validation.RegexMatch(validator, v, "TableId"); err != nil {
		return err
	}
	return nil
}

func Parse(tableId string) (TableName, error) {
	var ret TableName
	err := checked.Set(&ret, tableId)
	return ret, err
}

func MustParse(tableId string) TableName {
	ret, err := Parse(tableId)
	errorz.Check(err)
	return ret
}
