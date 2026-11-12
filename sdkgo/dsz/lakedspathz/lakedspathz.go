package lakedspathz

import (
	"fmt"
	"strings"

	"github.com/infinity6-ai/gox/commonz/constraintz/optionalz"
	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/hivepartz"
	"github.com/infinity6-ai/gox/commonz/pathz"
	"github.com/infinity6-ai/gox/commonz/stringz"
	"github.com/infinity6-ai/gox/commonz/validation/checked"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketablez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbpathz"
)

const Schema = "i6ds://"

type ParsedPath interface {
	Dataset() lakedsz.Dataset
	Table() laketablez.Table
	Partitions() *hivepartz.HiveParts
	File() *pathz.Path
}

type parsedPathImpl struct {
	dataset    lakedsz.Dataset
	table      laketablez.Table
	partitions *hivepartz.HiveParts
	file       *pathz.Path
}

func (v parsedPathImpl) Dataset() lakedsz.Dataset {
	return v.dataset
}

func (v parsedPathImpl) File() *pathz.Path {
	return v.file
}

func (v parsedPathImpl) Partitions() *hivepartz.HiveParts {
	return v.partitions
}

func (v parsedPathImpl) Table() laketablez.Table {
	return v.table
}

func (v parsedPathImpl) format() string {
	return Schema + pathz.MustParse(v.dataset.String()).MustJoin(pathz.MustParse(v.table.String())).MustJoin(v.partitions.Format()).MustJoin(v.file).String()
}

func (v parsedPathImpl) String() string {
	return v.format()
}

func (v *parsedPathImpl) Parse(s string) error {
	*v = parsedPathImpl{}
	if s == "" {
		return fmt.Errorf("path must not be empty")
	}
	s, found := strings.CutPrefix(s, Schema)
	if !found {
		return fmt.Errorf("schema not found in %s, expected: %s", s, Schema)
	}
	p, err := pathz.Parse(s)
	if err != nil {
		return fmt.Errorf("error parsing %s path: %s: %w", Schema, s, err)
	}
	err = p.Validate(pathz.ValidateOptions{
		Absolute:   new(false),
		MaxParents: new(0),
		MinPart:    2,
	})
	if err != nil {
		return fmt.Errorf("error parsing %s path: %s: %w", Schema, s, err)
	}
	parts := p.Parts()

	var dataset lakedsz.Dataset
	if err := checked.Set(&dataset, parts[0]); err != nil {
		return fmt.Errorf("error parsing dataset part from %s path: %s: %w", Schema, s, err)
	}

	table, err := laketablez.New(parts[1])
	if err != nil {
		return fmt.Errorf("error parsing table part from %s path: %s: %w", Schema, s, err)
	}

	hp, pFile, err := hivepartz.Parse(pathz.New(0, parts[2:], false))
	if err != nil {
		return fmt.Errorf("error parsing hive parts/file from %s path: %s: %w", Schema, s, err)
	}

	v.dataset = dataset
	v.table = table
	v.partitions = hp
	v.file = pFile
	return nil
}

type Path checked.Value[string]

func (*Path) JSType() string {
	return jstypez.TypString
}

func (d Path) Optional() optionalz.Optional[string] {
	return checked.Value[string](d).Optional()
}

func (d Path) Get() string {
	return checked.Value[string](d).Get()
}

func (d Path) String() string {
	return d.Get()
}

func (d Path) MarshalJSON() ([]byte, error) {
	return checked.Marshal[string](d)
}

func (d *Path) UnmarshalJSON(data []byte) error {
	return checked.Unmarshal(d, data)
}

func (d Path) MustParse() ParsedPath {
	ret, err := d.Parse()
	errorz.Check(err)
	return ret
}

func (d Path) Parse() (ParsedPath, error) {
	var ret parsedPathImpl
	err := ret.Parse(d.Get())
	if err != nil {
		return nil, err
	}
	return ret, nil
}

func (d Path) Validate(v string) error {
	var ret parsedPathImpl
	return ret.Parse(v)
}

func Parse(name string) (Path, error) {
	var ret Path
	err := checked.Set(&ret, name)
	return ret, err
}

func MustParse(name string) Path {
	ret, err := Parse(name)
	errorz.Check(err)
	return ret
}

func From(p ParsedPath) Path {
	dataset := p.Dataset()
	table := p.Table()
	partitions := p.Partitions()
	file := p.File()
	ret, err := Build(dataset, table, partitions, file)
	errorz.Check(err)
	return ret
}

func TablePath(ds lakedsz.Dataset, tp laketbpathz.ParsedPath) Path {
	return MustBuild(ds, tp.Table(), tp.Partitions(), tp.File())
}

func MustBuild(dataset lakedsz.Dataset, table laketablez.Table, hiveParts *hivepartz.HiveParts, file *pathz.Path) Path {
	ret, err := Build(dataset, table, hiveParts, file)
	errorz.Check(err)
	return ret
}

func Build(dataset lakedsz.Dataset, table laketablez.Table, hiveParts *hivepartz.HiveParts, file *pathz.Path) (Path, error) {
	b := dataset.String() + "/" + table.String() + "/" + stringz.String(hiveParts) + "/" + stringz.String(file)
	var zero Path
	p, err := pathz.Parse(b)
	if err != nil {
		return zero, fmt.Errorf("error parsing path %s: %w", b, err)
	}
	return Parse(Schema + p.String())
}
