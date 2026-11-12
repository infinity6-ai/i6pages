package tfzapimodelmetadata

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
)

type TensorDetail struct {
	Name  string `json:"name"`
	Index int    `json:"index"`
	Shape []int  `json:"shape"`
	DType string `json:"dtype"`
}

type Req struct {
	ModelName string `json:"model_name"`
	Version   string `json:"version"`
}

type Resp struct {
	Inputs  []TensorDetail `json:"inputs"`
	Outputs []TensorDetail `json:"outputs"`
}

type Api struct {
	Req  *Req  `json:"req"`
	Resp *Resp `json:"resp"`
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "tfz-model-metadata",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Model Metadata",
				Summary: "Gets the input and output tensors of a model version.",
			}
		},
		Method: "GET",
		Path:   "/api/metadata/{model_name}/{version}",
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
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "Response containing the model tensors."},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &Resp{}
				}
				return map[string]*schemaz.Schema{
					"inputs": {
						Desc: &schemaz.Desc{Summary: "Model input tensors."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]TensorDetail, TensorDetail]{
							Slice:      func() *[]TensorDetail { return &d.Resp.Inputs },
							NewElement: func(idx int) TensorDetail { return TensorDetail{} },
							Get: func(idx int, element *TensorDetail) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"name": {
												Desc:  &schemaz.Desc{Summary: "Tensor name."},
												Field: func() any { return &element.Name },
											},
											"index": {
												Desc:  &schemaz.Desc{Summary: "Tensor index."},
												Field: func() any { return &element.Index },
											},
											"shape": {
												Desc: &schemaz.Desc{Summary: "Tensor dimensions."},
												Array: schemaz.NewArray(schemaz.ArrayOptions[[]int, int]{
													Slice: func() *[]int { return &element.Shape },
													Get: func(idx int, shape *int) *schemaz.Schema {
														return &schemaz.Schema{
															Field: func() any { return shape },
														}
													},
												}),
											},
											"dtype": {
												Desc:  &schemaz.Desc{Summary: "Tensor data type."},
												Field: func() any { return &element.DType },
											},
										}
									},
								}
							},
						}),
					},
					"outputs": {
						Desc: &schemaz.Desc{Summary: "Model output tensors."},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]TensorDetail, TensorDetail]{
							Slice:      func() *[]TensorDetail { return &d.Resp.Outputs },
							NewElement: func(idx int) TensorDetail { return TensorDetail{} },
							Get: func(idx int, element *TensorDetail) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"name": {
												Desc:  &schemaz.Desc{Summary: "Tensor name."},
												Field: func() any { return &element.Name },
											},
											"index": {
												Desc:  &schemaz.Desc{Summary: "Tensor index."},
												Field: func() any { return &element.Index },
											},
											"shape": {
												Desc: &schemaz.Desc{Summary: "Tensor dimensions."},
												Array: schemaz.NewArray(schemaz.ArrayOptions[[]int, int]{
													Slice: func() *[]int { return &element.Shape },
													Get: func(idx int, shape *int) *schemaz.Schema {
														return &schemaz.Schema{
															Field: func() any { return shape },
														}
													},
												}),
											},
											"dtype": {
												Desc:  &schemaz.Desc{Summary: "Tensor data type."},
												Field: func() any { return &element.DType },
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
	}
}
