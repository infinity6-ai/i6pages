package dszapisignedurl

import (
	"github.com/infinity6-ai/gox/fsz/fsz/fszsignmethod"
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/laketbpathz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type Path struct {
	Method fszsignmethod.SignMethod `json:"method"`
	Path   laketbpathz.Path         `json:"path"`
}

type Req struct {
	Dataset lakedsz.Dataset `json:"dataset"`
	Paths   []Path          `json:"paths"`
}

type Url struct {
	Url string `json:"url"`
}

func (u *Url) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"url": {
					Desc:  &schemaz.Desc{Summary: "signed URL."},
					Field: func() any { return &u.Url },
				},
			}
		},
	}
}

type Resp struct {
	Urls []*Url `json:"urls"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-signed-url",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Dataset Signed URLs",
				Summary: "Generates presigned URLs for accessing or mutating files in the specified dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/ds/dataset/{dataset}/signed-url",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Name of the dataset to generate signed URLs for."},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"paths": {
						Desc: &schemaz.Desc{Summary: "List of paths and HTTP methods to generate signed URLs for."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]Path, Path]{
							Slice: func() *[]Path { return &d.Req.Paths },
							Get: func(idx int, element *Path) *schemaz.Schema {
								return &schemaz.Schema{
									Desc: &schemaz.Desc{Summary: "Path and HTTP method specification for a signed URL."},
									Object: func(read bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"method": {
												Desc:  &schemaz.Desc{Summary: "HTTP method (e.g. GET, PUT) for the signed URL."},
												Field: func() any { return &d.Req.Paths[idx].Method },
											},
											"path": {
												Desc:  &schemaz.Desc{Summary: "File path within the dataset."},
												Field: func() any { return &d.Req.Paths[idx].Path },
											},
										}
									},
								}
							},
						}),
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Presigned URLs generated for the requested paths."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"urls": {
						Desc: &schemaz.Desc{Summary: "Signed URLs"},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]*Url, *Url]{
							NewElement: func(idx int) *Url { return &Url{} },
							Slice:      func() *[]*Url { return &d.Resp.Urls },
							Get:        func(idx int, element **Url) *schemaz.Schema { return (*element).Schema() },
						}),
					},
				}
			},
		},
	}
}
