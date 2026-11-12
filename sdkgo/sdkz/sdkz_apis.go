package sdkz

import (
	"fmt"
	"maps"
	"slices"

	"github.com/infinity6-ai/gox/commonz/validation/checker"
	"github.com/infinity6-ai/gox/routez/apiz"
	"github.com/infinity6-ai/gox/routez/sampleroutez/routezsamplefraction"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapicustomerportalcreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapidatasetlist"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapidatasetsolutions"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapidomainsolutionget"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapiingestiontokencreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapiingestiontokenslist"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapiloadresult"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapimodelget"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapipaymentautorenewupdate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapipaymentlist"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapiplanlist"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapirecsystokencreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapirecsystokenslist"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapisignedurl"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapistorecreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapistoredisplaycreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapistoredisplaylist"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapistorelist"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapistripecheckout"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapisubscriptionget"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapisubscriptionplanupdate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapitableget"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapitablelist"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/dszapi/dszapitokendelete"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/ingestzapi/ingestzapievent"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/ingestzapi/ingestzapigeturl"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/pipezapi/pipezget"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/pipezapi/pipezlist"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/pipezapi/pipezstart"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/pipezapi/scheduleractivate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/pipezapi/schedulerdeactivate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/tfzapi/tfzapimodelmetadata"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/tfzapi/tfzapimodelpredict"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthdevicecode"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthdevicetoken"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthexchange"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthgoogle"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthlogout"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthme"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthpasswordreset"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthpasswordsignin"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthpasswordsignup"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapiauthrefresh"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenaccessattenuate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenaccesscreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenrefresh"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenrefreshcreate"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenrefreshdelete"
	"go.code.infinity6.ai/sdkgo/sdkgo/apiz/userapi/userapidatasettokenrefreshlist"
)

var apis map[string]apiz.Api

func init() {
	add := func(as ...apiz.Api) {
		for _, a := range as {
			id := a.ApiSpec().Id
			old, ok := apis[id]
			if ok {
				panic(fmt.Sprintf("api id collision %s: old %T, new %T", id, old, a))
			}
			apis[id] = a
		}
	}

	samples := routezsamplefraction.Services()
	apis = make(map[string]apiz.Api, len(samples))
	for _, svc := range routezsamplefraction.Services() {
		add(svc.Api())
	}
	add(&ingestzapigeturl.Api{})

	// disabled in favor of ingestzapievent
	// add(ingestzapistream.AllApis()...)

	add(ingestzapievent.AllApis()...)
	// add(&ingestzapibatchsummary.Api{})
	add(&dszapisignedurl.Api{})
	add(&dszapitableget.Api{})
	add(&dszapitablelist.Api{})
	add(dszapiloadresult.AllApis()...)
	add(pipezstart.AllApis()...)
	add(scheduleractivate.AllApis()...)
	add(schedulerdeactivate.AllApis()...)
	add(&pipezlist.Api{})
	add(&pipezget.Api{})
	add(&dszapistoredisplaycreate.Api{})
	add(&dszapistoredisplaylist.Api{})
	add(&dszapistorecreate.Api{})
	add(&dszapistorelist.Api{})
	add(&dszapidatasetlist.Api{})
	add(&dszapidatasetsolutions.Api{})
	add(&dszapidomainsolutionget.Api{})
	add(&dszapiingestiontokenslist.Api{})
	add(&dszapiingestiontokencreate.Api{})
	add(&dszapirecsystokenslist.Api{})
	add(&dszapirecsystokencreate.Api{})
	add(&dszapitokendelete.Api{})
	add(&dszapimodelget.Api{})
	add(&tfzapimodelmetadata.Api{})
	add(&tfzapimodelpredict.Api{})
	add(&dszapistripecheckout.Api{})
	add(&dszapicustomerportalcreate.Api{})
	add(&dszapisubscriptionget.Api{})
	add(&dszapipaymentautorenewupdate.Api{})
	add(&dszapipaymentlist.Api{})
	add(&dszapiplanlist.Api{})
	add(&dszapisubscriptionplanupdate.Api{})
	add(&userapiauthdevicecode.Api{})
	add(&userapiauthdevicetoken.Api{})
	add(&userapiauthexchange.Api{})
	add(&userapiauthgoogle.Api{})
	add(&userapiauthlogout.Api{})
	add(&userapiauthme.Api{})
	add(&userapiauthpasswordreset.Api{})
	add(&userapiauthpasswordsignin.Api{})
	add(&userapiauthpasswordsignup.Api{})
	add(&userapiauthrefresh.Api{})
	add(&userapidatasettokenaccessattenuate.Api{})
	add(&userapidatasettokenaccesscreate.Api{})
	add(&userapidatasettokenrefresh.Api{})
	add(&userapidatasettokenrefreshcreate.Api{})
	add(&userapidatasettokenrefreshdelete.Api{})
	add(&userapidatasettokenrefreshlist.Api{})
}

func Apis() []apiz.Api {
	return slices.Collect(maps.Values(apis))
}

func Api(id string) apiz.Api {
	ret, ok := apis[id]
	checker.True(ok, "api not found: %s", id)
	return ret
}
