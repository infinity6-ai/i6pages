package userapidatasettokenaccessattenuate_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenaccessattenuate"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitUserDatasetTokenAccessAttenuateApi(t *testing.T) {
	ctx := t.Context()
	api := &userapidatasettokenaccessattenuate.Api{
		Req: userapidatasettokenaccessattenuate.Req{
			Subsolution: solution.MustParse("relevance"),
			Subgrants:   8,
			Newlabels:   map[string]string{"task": "query"},
			ExpSeconds:  1800,
			AuthHeader:  "Bearer tok-parent",
		},
		Resp: userapidatasettokenaccessattenuate.Resp{
			AccessToken: "tok-child-attenuated",
			Dataset:     lakedsz.MustParse("ds64l7qauv4l6512kf0c"),
			Solution:    solution.MustParse("relevance"),
			Grants:      8,
			Labels:      map[string]string{"task": "query"},
			ExpiresAt:   1792933262,
		},
	}

	apiCopy := jsonz.MustCopy(api, &userapidatasettokenaccessattenuate.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "user-dataset-token-access-attenuate", parsed.Spec.Id)
}
