package logzinit

import (
	"context"
	"io"

	"github.com/infinity6-ai/gox/commonz/deferz"
	"github.com/infinity6-ai/gox/commonz/logz"
	"github.com/infinity6-ai/gox/commonz/logz/tracerz"
	"go.code.infinity6.ai/sdkgo/sdkgo/logzinit/internal/logztracer"
	"google.golang.org/grpc"
)

var done = false

type Options struct {
	App       string
	Version   string
	ProjectId string
}

func Init(ctx context.Context, opts Options) (context.Context, io.Closer) {
	if done {
		panic("already configured")
	}
	if opts.App == "" {
		panic("app is required")
	}
	if opts.Version == "" {
		panic("version is required")
	}
	m := map[string]string{
		logz.CtxKeyAppName:        opts.App,
		logz.CtxKeyAppVersion:     opts.Version,
		logz.CtxKeyGaeProjectName: opts.ProjectId,
	}
	ctx = logz.SetAttrs(ctx, m)
	done = true
	grpc.EnableTracing = false
	dfz := deferz.New(ctx)
	tracerCloser := logztracer.InitTracer(ctx, opts.App, opts.Version, &logztracer.Options{ProjectId: opts.ProjectId})
	dfz.AddCloserS(tracerCloser)
	// metricsClose := logztracer.InitMetric(ctx, opts.App, opts.Version, tracerOptions)
	if opts.ProjectId != "" {
		tracerz.Init(opts.App)
		// meterz.Init(app.App)
	}
	return ctx, dfz.Detach()
}
