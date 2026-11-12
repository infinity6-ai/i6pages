package logztracer

import (
	"context"
	"fmt"
	"io"
	"os"

	traceExporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"
	"github.com/infinity6-ai/gox/commonz/configz"
	"github.com/infinity6-ai/gox/commonz/errorz"
	"github.com/infinity6-ai/gox/commonz/ioz"
	"github.com/infinity6-ai/gox/commonz/logz"
	"github.com/infinity6-ai/gox/commonz/strconvz"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/propagation"
	"go.opentelemetry.io/otel/sdk/resource"
	semconv "go.opentelemetry.io/otel/semconv/v1.17.0"

	sdktrace "go.opentelemetry.io/otel/sdk/trace"
)

type tlogger logz.Type

var logger = logz.Create(tlogger(true))

var I6_TRACER_RATIO = configz.Create("I6_TRACER_RATIO", "0.1")

type Options struct {
	ProjectId string
}

func initExporterGcp(opts *Options) sdktrace.SpanExporter {
	ret, err := traceExporter.New(traceExporter.WithProjectID(opts.ProjectId))
	errorz.Check(err)
	return ret
}

func initExporter(ctx context.Context, opts *Options) sdktrace.SpanExporter {
	providerName := os.Getenv("I6_LOGZ_TRACER_PROVIDER")
	logger.Info(ctx, "logztracer init", map[string]any{"providerName": providerName, "opts": opts})
	switch providerName {
	case "":
		return nil
	case "gcp":
		return initExporterGcp(opts)
	}
	panic(fmt.Sprintf("unknown providerName: %s", providerName))
}

func createResource(ctx context.Context, app string, version string) *resource.Resource {
	res, err := resource.New(ctx,
		resource.WithAttributes(
			semconv.ServiceName(app),
			semconv.ServiceVersion(version),
		),
	)
	errorz.Check(err)
	return res
}

func InitTracer(ctx context.Context, app string, version string, opts *Options) io.Closer {
	traceExporter := initExporter(ctx, opts)
	if traceExporter == nil {
		return ioz.CloserV(func() {})
	}
	ratio := strconvz.MustParseNumber[float64](I6_TRACER_RATIO.Req(ctx))
	res := createResource(ctx, app, version)
	traceProvider := sdktrace.NewTracerProvider(
		sdktrace.WithSampler(sdktrace.ParentBased(sdktrace.TraceIDRatioBased(ratio))),
		sdktrace.WithBatcher(traceExporter),
		sdktrace.WithResource(res),
	)
	otel.SetTracerProvider(traceProvider)
	otel.SetTextMapPropagator(propagation.TraceContext{})

	return ioz.Closer(func() error {
		return traceProvider.Shutdown(ctx)
	})
}

// func initMetricExporterGcp(opts *Options) sdkmetric.Exporter {
// 	ret, err := metric.New(metric.WithProjectID(opts.ProjectId))
// 	errorz.Check(err)
// 	return ret
// }

// func initMetricExporter(ctx context.Context, opts *Options) sdkmetric.Exporter {
// 	providerName := os.Getenv("I6_LOGZ_TRACER_PROVIDER")
// 	logger.Info(ctx, "logzmetric init", map[string]any{"providerName": providerName, "opts": opts})
// 	switch providerName {
// 	case "":
// 		return nil
// 	case "gcp":
// 		return initMetricExporterGcp(opts)
// 	}
// 	panic(fmt.Sprintf("unknown providerName: %s", providerName))
// }

// func InitMetric(ctx context.Context, app string, version string, opts *Options) io.Closer {
// 	metricExporter := initMetricExporter(ctx, opts)
// 	if metricExporter == nil {
// 		return ioz.CloserV(func() {})
// 	}

// 	res := createResource(ctx, app, version)
// 	metricProvider := sdkmetric.NewMeterProvider(
// 		sdkmetric.WithResource(res),
// 		sdkmetric.WithReader(sdkmetric.NewPeriodicReader(metricExporter, sdkmetric.WithInterval(15*time.Second))),
// 	)
// 	otel.SetMeterProvider(metricProvider)
// 	return ioz.Closer(func() error {
// 		return metricProvider.Shutdown(ctx)
// 	})
// }
