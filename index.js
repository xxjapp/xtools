"use strict"

window.w = window.w || console.warn.bind(console)

if (document.readyState != "loading") {
    onReady()
} else {
    document.addEventListener("DOMContentLoaded", onReady)
}

function adjustUI() {
    if (navigator.clipboard) {
        document.getElementById("copy-button").classList.remove("d-none")
    }
}

function addEventListeners() {
    window.addEventListener("focus", onFocusWindow)
    document.getElementById("encode-button").addEventListener("click", onEncode)
    document.getElementById("decode-button").addEventListener("click", onDecode)
    document.getElementById("copy-button").addEventListener("click", onCopy)
}

function onReady() {
    adjustUI()
    addEventListeners()
    pasteClipboardText(tryEncodeOrDecode)
}

function onFocusWindow() {
    pasteClipboardText(tryEncodeOrDecode)
}

function onEncode() {
    let input = document.getElementById("input1").value
    let output = encodeURIComponent(input)
    document.getElementById("output1").value = output
}

function onDecode() {
    let input = document.getElementById("input1").value
    let output = decodeURIComponent(input)
    document.getElementById("output1").value = output
}

function onCopy() {
    let output = document.getElementById("output1").value

    navigator.clipboard && navigator.clipboard.writeText(output).then(function() {
        xdialog.info("clipboard successfully set")
    }, function() {
        xdialog.warn("clipboard write failed")
    })
}

function pasteClipboardText(onDone) {
    navigator.clipboard && navigator.clipboard.readText().then(function(clipText) {
        document.getElementById("input1").value = clipText
        onDone && onDone()
    })
}

function tryEncodeOrDecode() {
    let input = document.getElementById("input1").value
    let output = null

    try {
        output = decodeURIComponent(input)
    } catch {
        // OK: can not be decoded
    }

    // if input can not be decoded or decoded to the same result, try to encode input
    if (!output || input === output) {
        output = encodeURIComponent(input)
    }

    document.getElementById("output1").value = output
}
