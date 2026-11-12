package solution

import (
	"fmt"

	"github.com/infinity6-ai/gox/commonz/constraintz/optionalz"
	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/validation"
	"github.com/infinity6-ai/gox/commonz/validation/checked"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
)

type Solution checked.Value[string]

func (*Solution) JSType() string {
	return jstypez.TypString
}

func (d Solution) Optional() optionalz.Optional[string] {
	return checked.Value[string](d).Optional()
}

func (d Solution) Get() string {
	return checked.Value[string](d).Get()
}

func (d Solution) String() string {
	return d.Get()
}

func (d Solution) MarshalJSON() ([]byte, error) {
	return checked.Marshal[string](d)
}

func (d *Solution) UnmarshalJSON(data []byte) error {
	return checked.Unmarshal(d, data)
}

func (d Solution) Validate(v string) error {
	if err := validation.StrNotEmpty(v, "Solution cannot be empty"); err != nil {
		return err
	}
	if err := validation.OneOf([]string{"relevance", "plat", "dummysolution", "prcbidding"}, v, "Solution"); err != nil {
		return err
	}
	return nil
}

func MustParse(id string) Solution {
	var ret Solution
	checked.MustSet(&ret, id)
	return ret
}

func ParseOptional(id string) (Solution, error) {
	if id == "" {
		return Solution{}, nil
	}
	var ret Solution
	err := checked.Set(&ret, id)
	return ret, err
}

func MustParseOptional(id string) Solution {
	ret, err := ParseOptional(id)
	errorz.Check(err)
	return ret
}

type Id uint8

type Entry struct {
	Id       Id
	Solution Solution
}

var ids = make(map[Id]Solution, 8)
var names = make(map[Solution]Id, 8)
var strs = make(map[string]struct{}, 8)

func create(id Id, name string) Entry {
	s := MustParse(name)
	ids[id] = s
	names[s] = id
	strs[s.Get()] = struct{}{}
	return Entry{Id: id, Solution: s}
}

func (s Solution) Id() Id {
	ret, ok := names[s]
	if !ok {
		panic(fmt.Errorf("unknown: %s", s))
	}
	return ret
}

func By(id Id) Solution {
	ret, ok := ids[id]
	if !ok {
		panic(fmt.Errorf("unknown: %x", id))
	}
	return ret
}

var (
	relevance     = create(1<<0, "relevance")
	plat          = create(1<<1, "plat")
	dummySolution = create(1<<2, "dummysolution")
	prcbidding    = create(1<<3, "prcbidding")
)

func Relevance() Entry     { return relevance }
func Plat() Entry          { return plat }
func DummySolution() Entry { return dummySolution }
func PrcBidding() Entry    { return prcbidding }

func ParseStr(out *Solution) func() *schemaz.Parser[string] {
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
