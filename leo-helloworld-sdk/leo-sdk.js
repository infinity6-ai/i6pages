(() => {

    class LeoSdk {

        async hellworld(msg) {
            return new Promise(resolve => {
                const loc = '' + location.href
                setTimeout(() => resolve(`reply by leosdk: ${msg}, location: ${location.href}`), 2000)
            })
        }

        async sum(a, b) {
            return new Promise(resolve => {
                const loc = '' + location.href
                const result = a + b
                setTimeout(() => resolve(`sum leosdk: ${result}, location: ${location.href}`), 2000)
            })
        }

    }

    window.leosdk = new LeoSdk()

})()