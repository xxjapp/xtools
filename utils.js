"use strict"

window.utils = (function() {
    return {
        parseQueryString: parseQueryString
    }

    function parseQueryString(url) {
        let start = url.indexOf("?")

        if (start < 0) {
            return {}
        }

        let queryString = url.substring(start + 1)
        let a = queryString.split("&")

        if (a == "") {
            return {}
        }

        let b = {}

        for (let i = 0; i < a.length; ++i) {
            let p = a[i].split("=", 2)

            if (p.length == 1) {
                b[p[0]] = ""
            } else {
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "))
            }
        }

        return b
    }
})()
