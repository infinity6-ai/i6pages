package dszapipaymentlist

import (
	"time"

	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"

	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

type Req struct {
	Dataset lakedsz.Dataset
}

type PaymentLine struct {
	Id          string
	Solution    solution.Solution
	Amount      int64
	Description string
}

type Payment struct {
	Id            string
	Number        string
	Status        string
	Currency      string
	AmountDue     int64
	AmountPaid    int64
	Created       time.Time
	PeriodStart   time.Time
	PeriodEnd     time.Time
	InvoicePdfUrl string
	ReceiptPdfUrl string
	Lines         []PaymentLine
}

type Resp struct {
	Payments []Payment
}

type Api struct {
	Req  *Req
	Resp *Resp
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-list-payments",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "List Payments",
				Summary: "Lists the Stripe payments (invoices) of a dataset. The list is empty for datasets without a Stripe customer.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ds/dataset/{dataset}/payments",
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
						Desc:     &schemaz.Desc{Summary: "Dataset of the payments"},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
				}
			},
		},
		QueryParams: nil,
		ReqHeaders:  nil,
		ReqBody:     nil,
		RespHeaders: nil,
		RespBody: &schemaz.Schema{
			Desc: &schemaz.Desc{Summary: "The payments of the dataset"},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &Resp{}
				}
				if d.Resp.Payments == nil {
					d.Resp.Payments = []Payment{}
				}
				return map[string]*schemaz.Schema{
					"payments": {
						Desc: &schemaz.Desc{Summary: "Payments in the order of Stripe, newest first"},
						Array: schemaz.NewArray(schemaz.ArrayOptions[[]Payment, Payment]{
							Slice: func() *[]Payment { return &d.Resp.Payments },
							Get: func(idx int, element *Payment) *schemaz.Schema {
								return &schemaz.Schema{
									Object: func(_ bool) map[string]*schemaz.Schema {
										return map[string]*schemaz.Schema{
											"id": {
												Desc:  &schemaz.Desc{Summary: "Id of the invoice in Stripe"},
												Field: func() any { return &element.Id },
											},
											"number": {
												Desc:  &schemaz.Desc{Summary: "Number of the invoice"},
												Field: func() any { return &element.Number },
											},
											"status": {
												Desc:  &schemaz.Desc{Summary: "Status of the invoice in Stripe, without translation: draft, open, paid, uncollectible or void"},
												Field: func() any { return &element.Status },
											},
											"currency": {
												Desc:  &schemaz.Desc{Summary: "Three-letter currency code, like brl"},
												Field: func() any { return &element.Currency },
											},
											"amount_due": {
												Desc:  &schemaz.Desc{Summary: "Amount due, in the minor unit of the currency (cents)"},
												Field: func() any { return &element.AmountDue },
											},
											"amount_paid": {
												Desc:  &schemaz.Desc{Summary: "Amount paid, in the minor unit of the currency (cents)"},
												Field: func() any { return &element.AmountPaid },
											},
											"created": {
												Desc:  &schemaz.Desc{Summary: "When the invoice was created, in UTC"},
												Field: func() any { return &element.Created },
											},
											"period_start": {
												Desc:  &schemaz.Desc{Summary: "Start of the billing period, in UTC"},
												Field: func() any { return &element.PeriodStart },
											},
											"period_end": {
												Desc:  &schemaz.Desc{Summary: "End of the billing period, in UTC"},
												Field: func() any { return &element.PeriodEnd },
											},
											"invoice_pdf_url": {
												Desc:  &schemaz.Desc{Summary: "Pdf of the invoice"},
												Field: func() any { return &element.InvoicePdfUrl },
											},
											"receipt_pdf_url": {
												Desc:  &schemaz.Desc{Summary: "Pdf of the receipt"},
												Field: func() any { return &element.ReceiptPdfUrl },
											},
											"lines": {
												Desc: &schemaz.Desc{Summary: "Line items of the invoice"},
												Array: schemaz.NewArray(schemaz.ArrayOptions[[]PaymentLine, PaymentLine]{
													Slice: func() *[]PaymentLine { return &element.Lines },
													Get: func(lineIdx int, lineElement *PaymentLine) *schemaz.Schema {
														return &schemaz.Schema{
															Object: func(_ bool) map[string]*schemaz.Schema {
																return map[string]*schemaz.Schema{
																	"id": {
																		Desc:  &schemaz.Desc{Summary: "Id of the line item in Stripe"},
																		Field: func() any { return &lineElement.Id },
																	},
																	"solution": {
																		Desc:  &schemaz.Desc{Summary: "Solution (product) of the line item"},
																		Field: func() any { return &lineElement.Solution },
																	},
																	"amount": {
																		Desc:  &schemaz.Desc{Summary: "Amount of the line item in minor unit"},
																		Field: func() any { return &lineElement.Amount },
																	},
																	"description": {
																		Desc:  &schemaz.Desc{Summary: "Description of the line item"},
																		Field: func() any { return &lineElement.Description },
																	},
																}
															},
														}
													},
												}),
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
