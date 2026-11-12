package cmdsdkjs

import (
	"os"

	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/filez"
	"github.com/infinity6-ai/gox/commonz/logz"
	"github.com/spf13/cobra"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparsersdkfunc"
	"go.code.infinity6.ai/sdkgo/genjsz/jswriter"
	"go.code.infinity6.ai/sdkgo/sdkgo/sdkz"
)

type tlogger logz.Type

var logger = logz.Create(tlogger(true))

func Prepare(parent *cobra.Command) *cobra.Command {
	cmd := &cobra.Command{
		Use: "js",
	}
	parent.AddCommand(cmd)

	cmd.AddCommand(prepareGenerateJsCmd())

	return cmd
}

func prepareGenerateJsCmd() *cobra.Command {
	var out string
	cmd := &cobra.Command{
		Use:   "generate",
		Short: "generate the JS client of every API into the legacy web SDK",
		Args:  cobra.NoArgs,
		RunE: func(cmd *cobra.Command, args []string) error {
			ctx := cmd.Context()
			out := errorz.Check2(cmd.Flags().GetString("out"))

			apis := sdkz.Apis()
			parsedApis := jsparserapi.ParseApis(ctx, apis)

			funcs := sdkz.SdkFuncs()
			parsedSdkFuncs := jsparsersdkfunc.ParseSdkFuncs(ctx, funcs)

			code := []byte(jswriter.Write(ctx, jswriter.Options{
				Apis:     parsedApis.Apis,
				SdkFuncs: parsedSdkFuncs.SdkFuncs,
			}))

			errorz.Check(filez.CreateParentDirs(out))
			err := os.WriteFile(out, []byte(code), os.ModePerm)
			errorz.Check(err)
			logger.Info(ctx, "sdkapis generated", map[string]any{"out": out, "len": len(code)})
			return nil
		},
	}
	cmd.Flags().StringVar(&out, "out", "sdkweblegacy/src/sdkapis/sdkapis.js", "output directory, one .js file per api")
	return cmd
}
