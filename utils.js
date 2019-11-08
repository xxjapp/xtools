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

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/startsWith
if (!String.prototype.startsWith) {
    Object.defineProperty(String.prototype, 'startsWith', {
        value: function(search, rawPos) {
            var pos = rawPos > 0 ? rawPos | 0 : 0;
            return this.substring(pos, pos + search.length) === search;
        }
    });
}
