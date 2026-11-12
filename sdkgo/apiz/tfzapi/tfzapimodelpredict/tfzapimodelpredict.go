package tfzapimodelpredict

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type Req struct {
	Dataset         string
	ModelName       string
	Version         string
	ModelPartitions map[string]string
	Inputs          string
}

type Resp struct {
	Outputs string
}

type Api struct {
	Req  *Req
	Resp *Resp
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "tfz-model-predict",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Model Predict",
				Summary: "Runs a prediction of a dataset model version on the inference service (tfinfer), sending the model inputs and the model partitions and returning the model outputs.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset, "servname": "tfinfer"},
			}
		},
		Method: "POST",
		Path:   "/api/model/dataset/{dataset}/{model_name}/{version}/predict",
	}
}

func (d *Api) ApiDataRefs() *apiz.DataRefs {
	return &apiz.DataRefs{
		PathParams: &schemaz.Schema{
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &Req{}
				}
				return map[string]*schemaz.Schema{
					"dataset": {
						Desc:     &schemaz.Desc{Summary: "Dataset identifier."},
						UrlValue: schemaz.ParseStr(&d.Req.Dataset),
					},
					"model_name": {
						Desc:     &schemaz.Desc{Summary: "Model name."},
						UrlValue: schemaz.ParseStr(&d.Req.ModelName),
					},
					"version": {
						Desc:     &schemaz.Desc{Summary: "Model version."},
						UrlValue: schemaz.ParseStr(&d.Req.Version),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Model inputs and partitions."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Req == nil {
					return nil
				}
				if d.Req == nil {
					d.Req = &Req{}
				}
				return map[string]*schemaz.Schema{
					"inputs": {
						Desc:  &schemaz.Desc{Summary: "Model inputs."},
						Field: func() any { return &d.Req.Inputs },
					},
					"model_partitions": {
						Desc:  &schemaz.Desc{Summary: "Model partition key/value pairs."},
						Field: func() any { return &d.Req.ModelPartitions },
					},
				}
			},
		},
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response containing the model outputs."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &Resp{}
				}
				return map[string]*schemaz.Schema{
					"outputs": {
						Desc:  &schemaz.Desc{Summary: "Model outputs."},
						Field: func() any { return &d.Resp.Outputs },
					},
				}
			},
		},
	}
}
