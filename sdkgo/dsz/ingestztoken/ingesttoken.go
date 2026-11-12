package ingestztoken

import (
	"github.com/infinity6-ai/gox/commonz/validation/checker"
)

type IngestToken string

func (i IngestToken) Get() string {
	return string(i)
}

func MustParse(val string) IngestToken {
	checker.StrNotEmpty(val, "ingestoken")
	return IngestToken(val)
}
