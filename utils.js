"use strict"

window.utils = (function() {
    return {
        parseQueryString: parseQueryString,
        sendSkippableTask: sendSkippableTask
    }

    function parseQueryString(url) {
        let start = url.indexOf("?")

        if (start < 0) {
            return {}
        }

        let queryString = url.substring(start + 1)
        let a = queryString.split("&")

        if (a === "") {
            return {}
        }

        let b = {}

        for (let i = 0; i < a.length; ++i) {
            let p = a[i].split("=", 2)

            if (p.length === 1) {
                b[p[0]] = ""
            } else {
                b[p[0]] = decodeURIComponent(p[1].replace(/\+/g, " "))
            }
        }

        return b
    }

    function sendSkippableTask(taskCtx, param, handler, resultHandler) {
        taskCtx.queue = taskCtx.queue || []
        taskCtx.queue.push(param)

        if (taskCtx.iid) {
            // process already started, return
            return
        }

        // handle task every 100ms
        taskCtx.iid = setInterval(handleTask, 100);
        // w("setInterval: " + taskCtx.iid)

        function handleTask() {
            if (taskCtx.isBuzy) {
                return
            }

            if (taskCtx.queue.length === 0) {
                taskCtx.idleCnt = (taskCtx.idleCnt || 0)
                taskCtx.idleCnt++;

                // stop running and cleanup on 100 idles
                if (taskCtx.idleCnt === 100) {
                    clearInterval(taskCtx.iid);
                    // w("clearInterval: " + taskCtx.iid)
                    cleanupTaskContext()
                }

                return
            }

            taskCtx.isBuzy = true
            taskCtx.idleCnt = 0
            let lastParam = taskCtx.queue.pop()

            if (taskCtx.queue.length > 0) {
                // w("skipped " + taskCtx.queue.length + " tasks!")
                taskCtx.queue = []
            }

            let result = handler(lastParam)
            resultHandler && resultHandler(result)

            taskCtx.isBuzy = false
        }

        function cleanupTaskContext() {
            taskCtx.queue = []
            taskCtx.isBuzy = false
            taskCtx.idleCnt = 0
            taskCtx.iid = null
        }
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
