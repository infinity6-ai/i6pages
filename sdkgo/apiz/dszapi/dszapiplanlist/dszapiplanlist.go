package dszapiplanlist

import (
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"
)

type Req struct {
	Solution solution.Solution
}

// Plan is an allowed plan with the values of its Stripe price, without translation.
// Key is {solution}_{tier}_{frequency}_{name}, like relevance_growth_monthly_2027.
// Each plan has 2 Stripe prices, {key}_lic (license) and {key}_req (request count).
type Plan struct {
	Key       string
	Tier      string
	Frequency string
	Name      string
	// Description is the "Price description" of the Stripe price (its nickname), to show to the user.
	Description string
	Currency    string
	// Amount is kept for compatibility, and equals LicAmount.
	Amount int64
	// LicAmount is the price of the license, in the minor unit of the currency.
	LicAmount int64
	// ReqAmount is the price of the request count, in the minor unit of the currency.
	ReqAmount int64
	// ReqAmountDecimal is the price of each request above IncludedRequests, in cents with decimal places
	// (like Stripe unit_amount_decimal), e.g. "0.0294". "0" is explicitly free. Empty is not configured
	// and the field is omitted from the response.
	ReqAmountDecimal string
	// IncludedRequests is the number of requests included per period. Nil with IncludedRequestsUnlimited
	// false means not informed (the field is omitted from the response).
	IncludedRequests *int64
	// IncludedRequestsUnlimited makes included_requests null in the response (unlimited).
	// A JSON null is not read back, so a Go client sees unlimited as nil, like not informed.
	IncludedRequestsUnlimited bool
}

type Resp struct {
	Plans []Plan
}

type Api struct {
	Req  *Req
	Resp *Resp
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-list-plans",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "List Plans",
				Summary: "Lists the plans a subscription of a solution can be switched to, with the price data from Stripe.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.User,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ds/solution/{solution}/plans",
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
					"solution": {
						Desc:     &schemaz.Desc{Summary: "Solution (product) to list plans from"},
						UrlValue: schemaz.ParseStrGet(&d.Req.Solution, solution.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "The allowed plans of the solution"},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &Resp{}
				}
				if d.Resp.Plans == nil {
					d.Resp.Plans = []Plan{}
				}
				return map[string]*schemaz.Schema{
					"plans": {
						Desc: &schemaz.Desc{Summary: "Allowed plans, each one found in Stripe"},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]Plan, Plan]{
							Slice: func() *[]Plan { return &d.Resp.Plans },
							Get: func(idx int, element *Plan) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(read bool) map[string]*schemaz.Schema {
										fields := map[string]*schemaz.Schema{
											"key": {
												Desc:  &schemaz.Desc{Summary: "Plan key (base of the Stripe lookup keys {key}_lic and {key}_req), used to switch to the plan"},
												Field: func() any { return &element.Key },
											},
											"tier": {
												Desc:  &schemaz.Desc{Summary: "Tier of the plan, like growth"},
												Field: func() any { return &element.Tier },
											},
											"frequency": {
												Desc:  &schemaz.Desc{Summary: "Billing frequency of the plan, like monthly"},
												Field: func() any { return &element.Frequency },
											},
											"name": {
												Desc:  &schemaz.Desc{Summary: "Name of the plan, like 2027"},
												Field: func() any { return &element.Name },
											},
											"description": {
												Desc:  &schemaz.Desc{Summary: "Price description set in Stripe (the price nickname), to show to the user"},
												Field: func() any { return &element.Description },
											},
											"currency": {
												Desc:  &schemaz.Desc{Summary: "Three-letter currency code, like brl"},
												Field: func() any { return &element.Currency },
											},
											"amount": {
												Desc:  &schemaz.Desc{Summary: "Same as lic_amount, kept for compatibility"},
												Field: func() any { return &element.Amount },
											},
											"lic_amount": {
												Desc:  &schemaz.Desc{Summary: "License price in the minor unit of the currency (cents)"},
												Field: func() any { return &element.LicAmount },
											},
											"req_amount": {
												Desc:  &schemaz.Desc{Summary: "Request count price in the minor unit of the currency (cents)"},
												Field: func() any { return &element.ReqAmount },
											},
										}
										// Omitted when not informed, which differs from null (included_requests) and "0" (req_amount_decimal).
										if !read || element.ReqAmountDecimal != "" {
											fields["req_amount_decimal"] = &schemaz.Schema{
												Desc:  &schemaz.Desc{Summary: "Price of each request above included_requests, in cents with decimal places, as Stripe unit_amount_decimal (like 0.0294). \"0\" means no extra charge; absent means not configured"},
												Field: func() any { return &element.ReqAmountDecimal },
											}
										}
										if !read || element.IncludedRequestsUnlimited || element.IncludedRequests != nil {
											fields["included_requests"] = &schemaz.Schema{
												Desc: &schemaz.Desc{Summary: "Requests included per period of the plan. null means unlimited; absent means not informed"},
												Field: func() any {
													if read && element.IncludedRequestsUnlimited {
														return nil
													}
													return &element.IncludedRequests
												},
											}
										}
										return fields
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
