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
    let split = xhr.responseText.split(/<\/?script>/)
    let main = document.getElementById("main")

    // append html
    main.innerHTML = split[0]

    // set title
    try {
        document.title = document.querySelector(".xt-title").textContent + " | xtools"
    } catch (error) {
        document.title = "Error" + " | xtools"
    }

    // no script, return
    if (!split[1]) {
        return
    }

    // append script
    // SEE: https://stackoverflow.com/a/7054216/1440174
    let script = document.createElement("script")
    script.text = split[1]

    main.parentNode.insertBefore(script, main)

    // init and active part
    partObject.init()
    partObject.activate()
}

function onFocusWindow() {
    partObject && partObject.activate()
}

function onBlurWindow() {
    partObject && partObject.deactivate()
}
