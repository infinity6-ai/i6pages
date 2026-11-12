package solutiondomain

import (
	"fmt"
	"strings"

	"github.com/infinity6-ai/gox/commonz/constraintz/optionalz"
	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/infinity6-ai/gox/commonz/validation"
	"github.com/infinity6-ai/gox/commonz/validation/checked"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/genjsz/jstypez"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/domain"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

type Value struct {
	Solution solution.Solution `json:"solution"`
	Domain   domain.Domain     `json:"domain"`
}

func (v Value) format() string {
	return v.Solution.Get() + "_" + v.Domain.Get()
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
	parts := strings.SplitN(s, "_", 3)
	if err := validation.Equal(2, len(parts), "invalid parts length: %s", s); err != nil {
		return err
	}
	nv := Value{}
	if err := jsonz.ParseInto(jsonz.MustFormat(parts[0]).Bytes(), &nv.Solution); err != nil {
		return err
	}
	if err := jsonz.ParseInto(jsonz.MustFormat(parts[1]).Bytes(), &nv.Domain); err != nil {
		return err
	}
	if v == nil {
		v = &nv
	} else {
		v.Solution = nv.Solution
		v.Domain = nv.Domain
	}
	return nil
}

type SolutionDomain checked.Value[Value]

func (*SolutionDomain) JSType() string {
	return jstypez.TypString
}

func (t SolutionDomain) Optional() optionalz.Optional[Value] {
	return checked.Value[Value](t).Optional()
}

func (t SolutionDomain) Get() Value {
	return checked.Value[Value](t).Get()
}

func (t SolutionDomain) Solution() solution.Solution {
	return t.Get().Solution
}

func (t SolutionDomain) Domain() domain.Domain {
	return t.Get().Domain
}

func (t SolutionDomain) MarshalJSON() ([]byte, error) {
	return checked.Marshal[Value](t)
}

func (t SolutionDomain) String() string {
	return t.Get().String()
}

func (t *SolutionDomain) UnmarshalJSON(data []byte) error {
	return checked.Unmarshal(t, data)
}

func (t SolutionDomain) Validate(v Value) error {
	if err := validation.NotZero(v.Solution, "solution"); err != nil {
		return err
	}
	if err := validation.NotZero(v.Domain, "domain"); err != nil {
		return err
	}
	return nil
}

func Parse(name Value) (SolutionDomain, error) {
	var ret SolutionDomain
	err := checked.Set(&ret, name)
	return ret, err
}

func MustParse(name Value) SolutionDomain {
	ret, err := Parse(name)
	errorz.Check(err)
	return ret
}

func ParseString(s string) (SolutionDomain, error) {
	parts := strings.SplitN(s, "_", 2)
	if len(parts) != 2 {
		return SolutionDomain{}, fmt.Errorf("invalid solution domain: %s", s)
	}

	val := Value{
		Solution: solution.MustParse(parts[0]),
		Domain:   domain.MustParse(parts[1]),
	}

	return Parse(val)
}

func MustParseString(s string) SolutionDomain {
	ret, err := ParseString(s)
	errorz.Check(err)
	return ret
}

func ParseStr(out *SolutionDomain) func() *schemaz.Parser[string] {
	return func() *schemaz.Parser[string] {
		return &schemaz.Parser[string]{
			Parse: func(v string) {
				*out = MustParseString(v)
			},
			Format: func() (string, any) {
				var s string
				if out.Optional().IsPresent() {
					s = out.String()
				}
				return s, *out
			},
		}
	}
}
