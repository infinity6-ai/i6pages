package userapidatasettokenaccesscreate_test

import (
	"testing"

	"github.com/infinity6-ai/gox/commonz/jsonz"
	"github.com/stretchr/testify/require"
	"go.code.infinity6.ai/sdkgo/genjsz/jsparserapi"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenaccesscreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

func TestUnitUserDatasetTokenAccessCreateApi(t *testing.T) {
	ctx := t.Context()
	api := &userapidatasettokenaccesscreate.Api{
		Req: userapidatasettokenaccesscreate.Req{
			Dataset:    lakedsz.MustParse("ds64l7qauv4l6512kf0c"),
			Solution:   solution.MustParse("relevance"),
			Grants:     12,
			Labels:     map[string]string{"env": "prod"},
			ExpSeconds: 3600,
			AuthHeader: "Bearer eyJ...",
		},
		Resp: userapidatasettokenaccesscreate.Resp{
			AccessToken: "tok-abc",
			Dataset:     lakedsz.MustParse("ds64l7qauv4l6512kf0c"),
			Solution:    solution.MustParse("relevance"),
			Grants:      12,
			Labels:      map[string]string{"env": "prod"},
			ExpiresAt:   1792933262,
		},
	}

	apiCopy := jsonz.MustCopy(api, &userapidatasettokenaccesscreate.Api{})
	require.Equal(t, api.Req, apiCopy.Req)
	require.Equal(t, api.Resp, apiCopy.Resp)

	parsed := jsparserapi.ParseApi(ctx, api)
	require.NotNil(t, parsed)
	require.Equal(t, "user-dataset-token-access-create", parsed.Spec.Id)
}
