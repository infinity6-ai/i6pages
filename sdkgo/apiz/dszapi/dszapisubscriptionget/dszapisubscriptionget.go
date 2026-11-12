package dszapisubscriptionget

import (
	"time"

	"go.code.infinity6.ai/sdkgo/sdkgo/speclabels/speclabeltokentype"

	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/schemaz/schemaz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/lakedsz"
	"go.code.infinity6.ai/sdkgo/sdkgo/dsz/solution"
)

type Req struct {
	Dataset  lakedsz.Dataset
	Solution solution.Solution
}

// Resp has the stripe values without translation, and none of the buyer or the price.
// The body is empty ({}) for contracts without stripe, like custom and enterprise.
type Resp struct {
	PlanKey              string
	Status               string
	CancelAt             *time.Time
	CreatedAt            time.Time
	CancelAtPeriodEnd    bool
	TrialStartAt         *time.Time
	TrialEndAt           *time.Time
	CurrentPeriodStartAt time.Time
	CurrentPeriodEndAt   time.Time
	NextInvoiceAt        *time.Time
}

// Custom tells that the dataset has no stripe subscription
func (r *Resp) Custom() bool {
	return r.Status == ""
}

type Api struct {
	Req  *Req
	Resp *Resp
}

func (d *Api) ApiSpec() apiz.ApiSpec {
	return apiz.ApiSpec{
		Id: "dsz-get-subscription",
		Desc: func() *schemaz.Desc {
			return &schemaz.Desc{
				Name:    "Get Subscription",
				Summary: "Gets the plan and the status of the Stripe subscription of a dataset product/solution. The payload is empty for contracts without Stripe.",
				Labels: map[string]string{
					speclabeltokentype.Key: speclabeltokentype.Dataset,
				},
			}
		},
		Method: "GET",
		Path:   "/api/ds/dataset/{dataset}/solution/{solution}/subscription",
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
						Desc:     &schemaz.Desc{Summary: "Dataset of the subscription"},
						UrlValue: schemaz.ParseStrGet(&d.Req.Dataset, lakedsz.MustParse),
					},
					"solution": {
						Desc:     &schemaz.Desc{Summary: "Solution (product) of the subscription"},
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
			Desc: &schemaz.Desc{Summary: "The subscription; empty for datasets without a Stripe subscription"},
			Object: func(read bool) map[string]*schemaz.Schema {
				if read && d.Resp == nil {
					return nil
				}
				if d.Resp == nil {
					d.Resp = &Resp{}
				}
				if read && d.Resp.Custom() {
					return map[string]*schemaz.Schema{}
				}
				return map[string]*schemaz.Schema{
					"plan_key": {
						Desc:  &schemaz.Desc{Summary: "Lookup key of the base price in Stripe, like relevance_growth_base_monthly"},
						Field: func() any { return &d.Resp.PlanKey },
					},
					"status": {
						Desc:  &schemaz.Desc{Summary: "Status of the subscription in Stripe, without translation: active, trialing, past_due, unpaid, incomplete, canceled, incomplete_expired or paused"},
						Field: func() any { return &d.Resp.Status },
					},
					"cancel_at": {
						Desc:  &schemaz.Desc{Summary: "When the subscription will be or was canceled, in UTC; null when there is no cancellation"},
						Field: func() any { return &d.Resp.CancelAt },
					},
					"created_at": {
						Desc:  &schemaz.Desc{Summary: "When the subscription was created, in UTC"},
						Field: func() any { return &d.Resp.CreatedAt },
					},
					"cancel_at_period_end": {
						Desc:  &schemaz.Desc{Summary: "Whether the subscription will be canceled at the end of the current period"},
						Field: func() any { return &d.Resp.CancelAtPeriodEnd },
					},
					"trial_start_at": {
						Desc:  &schemaz.Desc{Summary: "When the subscription trial started, in UTC; null if there is no trial"},
						Field: func() any { return &d.Resp.TrialStartAt },
					},
					"trial_end_at": {
						Desc:  &schemaz.Desc{Summary: "When the subscription trial ends, in UTC; null if there is no trial"},
						Field: func() any { return &d.Resp.TrialEndAt },
					},
					"current_period_start_at": {
						Desc:  &schemaz.Desc{Summary: "Start of the current period, in UTC"},
						Field: func() any { return &d.Resp.CurrentPeriodStartAt },
					},
					"current_period_end_at": {
						Desc:  &schemaz.Desc{Summary: "End of the current period, in UTC"},
						Field: func() any { return &d.Resp.CurrentPeriodEndAt },
					},
					"next_invoice_at": {
						Desc:  &schemaz.Desc{Summary: "When the next invoice is scheduled, in UTC; null if none"},
						Field: func() any { return &d.Resp.NextInvoiceAt },
					},
				}
			},
		},
	}
}
