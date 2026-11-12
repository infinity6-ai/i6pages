package dszapimodelget

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type Req struct {
	Dataset         lakedsz.Dataset   `json:"dataset"`          // PathParam
	ModelName       string            `json:"model_name"`       // PathParam
	ModelVersion    string            `json:"model_version"`    // Body
	ModelPartitions map[string]string `json:"model_partitions"` // Body
}

type ModelFile struct {
	Name string `json:"name"` // Resp Body
	Url  string `json:"url"`  // Resp Body
}

func (u *ModelFile) Schema() *schemaz.Schema {
	return &schemaz.Schema{
		Desc: &schemaz.Desc{Summary: "File associated with a model, along with its presigned access URL."},
		Object: func(read bool) map[string]*schemaz.Schema {
			return map[string]*schemaz.Schema{
				"name": {
					Desc:  &schemaz.Desc{Summary: "File Name"},
					Field: func() any { return &u.Name },
				},
				"url": {
					Desc:  &schemaz.Desc{Summary: "signed URL."},
					Field: func() any { return &u.Url },
				},
			}
		},
	}
}

type Resp struct {
	Urls []*ModelFile `json:"urls"`
}

type Api struct {
	Req  Req  `json:"req"`
	Resp Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-model-get",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Model Signed URLs",
				Summary: "Generates presigned URLs for accessing model files in the specified dataset.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "POST",
		Path:   "/api/model/dataset/{dataset}/signed-get/{model_name}",
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
					"model_name": {
						Desc:     &schemaz.Desc{Summary: "Model name"},
						UrlValue: schemaz.ParseStr(&d.Req.ModelName),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Model parameters including version and partitions."},
			Object: func(read bool) map[string]*schemaz.Schema {
				return map[string]*schemaz.Schema{
					"model_version": {
						Desc:  &schemaz.Desc{Summary: "Model version"},
						Field: func() any { return &d.Req.ModelVersion },
					},
					"model_partitions": {
						Desc:  &schemaz.Desc{Summary: "Model partition key/value pairs"},
						Field: func() any { return &d.Req.ModelPartitions },
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
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]*ModelFile, *ModelFile]{
							NewElement: func(idx int) *ModelFile { return &ModelFile{} },
							Slice:      func() *[]*ModelFile { return &d.Resp.Urls },
							Get:        func(idx int, element **ModelFile) *schemaz.Schema { return (*element).Schema() },
						}),
					},
				}
			},
		},
	}
}
