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
}

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

    // append scripts
    segments.scripts.forEach(function(script) {
        if (script.startsWith("<script ")) {
            appendExternalScript(script)
        } else {
            appendInlineScript(script)
        }
    })

    // init and active part
    if (partObject) {
        partObject.init()
        partObject.activate()
    }
}

// seperate scripts and other part
function parseHtmlText(htmlText) {
    const sep = String(Math.random())

    let result = {
        scripts: []
    }

    result.html = unescape(escape(htmlText).replace(/<script( |>).*?<\/script>/g, function(match) {
        result.scripts.push(unescape(match))
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
function appendExternalScript(script) {
    let scriptElement = document.createElement("script")

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
