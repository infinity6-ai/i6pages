package userapidatasettokenrefresh_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenrefresh"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitUserDatasetTokenRefreshApi(t *testing.T) {
	ctx := t.Context()
	api := &userapidatasettokenrefresh.Api{
		Req: userapidatasettokenrefresh.Req{
			Signature:   "assertion-sig-b64",
			Dataset:     lakedsz.MustParse("ds64l7qauv4l6512kf0c"),
			Subsolution: solution.MustParse("relevance"),
			Subgrants:   8,
			Newlabels:   map[string]string{"task": "export"},
			ExpSeconds:  1800,
		},
		Resp: userapidatasettokenrefresh.Resp{
			AccessToken: "fresh-access-tok-b64",
			Dataset:     lakedsz.MustParse("ds64l7qauv4l6512kf0c"),
			Solution:    solution.MustParse("relevance"),
			Grants:      8,
			Labels:      map[string]string{"task": "export"},
			ExpiresAt:   1792933262,
		},
	}

	apiCopy := jsonz.MustCopy(api, &userapidatasettokenrefresh.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "user-dataset-token-refresh", parsed.Spec.Id)
}
