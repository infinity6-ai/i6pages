package laketablez

import (
	"fmt"
	"strings"

	"github.com/infinity6-ai/gox/commonz/constraintz/optionalz"
	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/infinity6-ai/gox/commonz/validation"
	"github.com/infinity6-ai/gox/commonz/validation/checked"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedbz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbnamez"
)

type Value struct {
	Database lakedbz.Database      `json:"database"`
	Name     laketbnamez.TableName `json:"name"`
}

func (v Value) format() string {
	return v.Database.Get() + "." + v.Name.Get()
}

func (v Value) String() string {
	return v.format()
}

func (v Value) MarshalJSON() ([]byte, error) {
	return jsonz.FormatBytes(v.format())
}

func (v *Value) UnmarshalJSON(data []byte) error {
	var s string
	if err := jsonz.ParseInto(data, &s); err != nil {
		return err
	}
	parts := strings.SplitN(s, ".", 3)
	if err := validation.Equal(2, len(parts), "invalid parts length: %s", s); err != nil {
		return err
	}
	nv := Value{}
	if err := jsonz.ParseInto(jsonz.MustFormat(parts[0]).Bytes(), &nv.Database); err != nil {
		return err
	}
	if err := jsonz.ParseInto(jsonz.MustFormat(parts[1]).Bytes(), &nv.Name); err != nil {
		return err
	}
	if v == nil {
		v = &nv
	} else {
		v.Database = nv.Database
		v.Name = nv.Name
	}
	return nil
}

type Table checked.Value[Value]

func (*Table) JSType() string {
	return jstypez.TypString
}

func (t Table) Optional() optionalz.Optional[Value] {
	return checked.Value[Value](t).Optional()
}

func (t Table) Get() Value {
	return checked.Value[Value](t).Get()
}

func (t Table) Database() lakedbz.Database {
	return t.Get().Database
}

func (t Table) Name() laketbnamez.TableName {
	return t.Get().Name
}

func (t Table) MarshalJSON() ([]byte, error) {
	return checked.Marshal[Value](t)
}

func (t Table) String() string {
	return t.Get().String()
}

func (t *Table) UnmarshalJSON(data []byte) error {
	return checked.Unmarshal(t, data)
}

func (t Table) Validate(v Value) error {
	if err := validation.NotZero(v.Database, "database"); err != nil {
		return err
	}
	if err := validation.NotZero(v.Name, "table"); err != nil {
		return err
	}
	return nil
}

func Parse(name Value) (Table, error) {
	var ret Table
	err := checked.Set(&ret, name)
	return ret, err
}

func MustParse(name Value) Table {
	ret, err := Parse(name)
	errorz.Check(err)
	return ret
}

func New(name string) (Table, error) {
	s := strings.SplitN(name, ".", 2)
	db, err := lakedbz.Parse(s[0])
	if err != nil {
		return Table{}, fmt.Errorf("error parsring database part from: %s", name)
	}
	table, err := laketbnamez.Parse(s[1])
	if err != nil {
		return Table{}, fmt.Errorf("error parsring table part from: %s", name)
	}
	return Parse(Value{
		Database: db,
		Name:     table,
	})
}

func Must(name string) Table {
	ret, err := New(name)
	errorz.Check(err)
	return ret
}
