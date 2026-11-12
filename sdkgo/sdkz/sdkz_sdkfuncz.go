package sdkz

import (
	"fmt"
	"maps"
	"slices"

	"github.com/infinity6-ai/gox/commonz/validation/checker"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashattachedrevenue"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashcoverage"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashfunnel"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashimpactedmetricsbyshowcasecategory"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashimpactedmetricsbysku"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/dash/relevancefashiondashlistshowcasecategories"
	"go.code.infinity6.ai/sdkgo/sdkgo/productz/relevance/inferz/inferzrelevancefashionfbt"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkfuncz"
)

var sdkFuncs map[string]sdkfuncz.Func

func init() {
	sdkFuncs = make(map[string]sdkfuncz.Func)

	add := func(i sdkfuncz.Func) {
		id := i.SdkFuncSpec().Id
		old, ok := sdkFuncs[id]
		if ok {
			panic(fmt.Sprintf("sdkfunc id collision %s: old %T, new %T", id, old, i))
		}
		sdkFuncs[id] = i
	}

	add(&inferzrelevancefashionfbt.Func{})
	add(&relevancefashiondashfunnel.Func{})
	add(&relevancefashiondashattachedrevenue.Func{})
	add(&relevancefashiondashlistshowcasecategories.Func{})
	add(&relevancefashiondashimpactedmetricsbyshowcasecategory.Func{})
	add(&relevancefashiondashimpactedmetricsbysku.Func{})
	add(&relevancefashiondashcoverage.Func{})
}

func SdkFuncs() []sdkfuncz.Func {
	return slices.Collect(maps.Values(sdkFuncs))
}

func SdkFunc(id string) sdkfuncz.Func {
	ret, ok := sdkFuncs[id]
	checker.True(ok, "sdkfunc not found: %s", id)
	return ret
}
