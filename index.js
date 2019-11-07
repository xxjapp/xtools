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

function loadPart(partName) {
    let xhr = new XMLHttpRequest()
    xhr.addEventListener("load", onLoadPart)
    xhr.open("GET", "parts/" + partName + ".part.html")
    xhr.send()
}

function onLoadPart() {
    let xhr = this

    // split by inline script open tag
    // NOTE: inline script element should be only one per part
    let segments = xhr.responseText.split("<script>")
    let main = document.getElementById("main")

    // append html
    main.innerHTML = segments[0]

    // set title
    try {
        document.title = document.querySelector(".xt-title").textContent + " | xtools"
    } catch (error) {
        document.title = "Error" + " | xtools"
    }

    // no script, return
    if (!segments[1]) {
        return
    }

    // append script
    // SEE: https://stackoverflow.com/a/7054216/1440174
    let scriptElement = document.createElement("script")
    scriptElement.text = segments[1].split("</script>")[0]

    document.body.appendChild(scriptElement)

    // init and active part
    if (partObject) {
        partObject.init()
        partObject.activate()
    }
}

function onFocusWindow() {
    partObject && partObject.activate()
}

function onBlurWindow() {
    partObject && partObject.deactivate()
}
