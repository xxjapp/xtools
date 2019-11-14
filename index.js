"use strict"

// define w for the convenience
window.w = window.w || console.warn.bind(console)

// call onReady
if (document.readyState != "loading") {
    onReady()
} else {
    document.addEventListener("DOMContentLoaded", onReady)
}

function onReady() {
    // init partObject
    window.partObject = null

    // load part
    let partName = utils.parseQueryString(window.location.href).p || "home"
    loadPart(partName)

    // add event listeners
    window.addEventListener("focus", onFocusWindow)
    window.addEventListener("blur", onBlurWindow)
}

function onFocusWindow() {
    partObject && partObject.activate()
}

function onBlurWindow() {
    partObject && partObject.deactivate()
}

function loadPart(partName) {
    let xhr = new XMLHttpRequest()
    xhr.addEventListener("load", onLoadPart)
    xhr.open("GET", "parts/" + partName + ".part.html")
    xhr.send()

    function onLoadPart(e) {
        let segments = parseHtmlText(e.target.responseText)
        let main = document.getElementById("main")

        // append html
        main.innerHTML = segments.html

        // set title
        try {
            document.title = document.querySelector(".xt-title").textContent + " | xtools"
        } catch (error) {
            document.title = "Error" + " | xtools"
        }

        // set nav-item style
        let navItem = document.querySelector('[href="?p=' + partName + '"]')
        navItem && navItem.classList.add("xt-nav-link-active");

        // append inline scripts
        segments.scripts.inline.forEach(appendInlineScript)

        // init part: do not call external script function here
        partObject && partObject.init()

        // append external scripts
        let n = segments.scripts.external.length

        if (n > 0) {
            segments.scripts.external.forEach(function(script) {
                appendExternalScript(script, function() {
                    n--

                    if (n === 0) {
                        onAllExternalScriptLoaded()
                    }
                })
            })
        } else {
            onAllExternalScriptLoaded()
        }

        function onAllExternalScriptLoaded() {
            // activate part: safe to call external script function here
            partObject && partObject.activate()
        }
    }
}

// seperate scripts and other part
function parseHtmlText(htmlText) {
    const sep = String(Math.random())

    let result = {
        html: "",
        scripts: {
            external: [],
            inline: []
        }
    }

    result.html = unescape(escape(htmlText).replace(/<script( |>).*?<\/script>/g, function(match) {
        let script = unescape(match)

        if (script.startsWith("<script ")) {
            result.scripts.external.push(script)
        } else {
            result.scripts.inline.push(script)
        }

        return ""
    }))

    return result

    function escape(text) {
        return text.replace(/\r?\n/g, sep)
    }

    function unescape(text) {
        return text.split(sep).join("\n")
    }
}

// SEE: https://stackoverflow.com/questions/28901166/how-do-i-add-the-crossorigin-tag-to-a-dynamically-loaded-script/28907499
function appendExternalScript(script, onScriptLoad) {
    let scriptElement = document.createElement("script")

    scriptElement.onload = onScriptLoad

    script.split(/<script |><\/script>/)[1].replace(/(\w+)="(.*?)"/g, function(_, p1, p2) {
        scriptElement.setAttribute(p1, p2)
    })

    document.body.appendChild(scriptElement)
}

// SEE: https://stackoverflow.com/a/7054216/1440174
function appendInlineScript(script) {
    let scriptElement = document.createElement("script")
    scriptElement.text = script.split(/<\/?script>/)[1]
    document.body.appendChild(scriptElement)
}
