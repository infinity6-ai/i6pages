package userapidatasettokenrefreshcreate_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenrefreshcreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitUserDatasetTokenRefreshCreateApi(t *testing.T) {
	ctx := t.Context()
	api := &userapidatasettokenrefreshcreate.Api{
		Req: userapidatasettokenrefreshcreate.Req{
			Dataset:    lakedsz.MustParse("ds64l7qauv4l6512kf0c"),
			Solution:   solution.MustParse("relevance"),
			Grants:     12,
			Labels:     map[string]string{"env": "prod"},
			Annotation: "Airflow Ingest",
			AuthHeader: "Bearer eyJ...",
		},
		Resp: userapidatasettokenrefreshcreate.Resp{
			Jti:        "jti-pubkey",
			Dataset:    lakedsz.MustParse("ds64l7qauv4l6512kf0c"),
			PrivKey:    "privkey-b64",
			Solution:   solution.MustParse("relevance"),
			Grants:     12,
			Labels:     map[string]string{"env": "prod"},
			ExpiresAt:  1792933262,
			Annotation: "Airflow Ingest",
		},
	}

	apiCopy := jsonz.MustCopy(api, &userapidatasettokenrefreshcreate.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "user-dataset-token-refresh-create", parsed.Spec.Id)
}
