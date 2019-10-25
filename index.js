"use strict"

window.w = window.w || console.warn.bind(console)

if (document.readyState != "loading") {
    onReady()
} else {
    document.addEventListener("DOMContentLoaded", onReady)
}

function onReady() {
    addEventListeners()
    pasteClipboardText(tryEncodeOrDecode)
}

function onFocusWindow() {
    pasteClipboardText(tryEncodeOrDecode)
}

function addEventListeners() {
    document.getElementById("encode-button").addEventListener("click", encode)
    document.getElementById("decode-button").addEventListener("click", decode)
    window.addEventListener("focus", onFocusWindow)
}

function pasteClipboardText(onDone) {
    navigator.clipboard && navigator.clipboard.readText().then(function(clipText) {
        document.getElementById("input1").value = clipText
        onDone && onDone()
    })
}

function encode() {
    let input = document.getElementById("input1").value
    let output = encodeURIComponent(input)
    document.getElementById("output1").value = output
}

function decode() {
    let input = document.getElementById("input1").value
    let output = decodeURIComponent(input)
    document.getElementById("output1").value = output
}

function tryEncodeOrDecode() {
    let input = document.getElementById("input1").value
    let output = decodeURIComponent(input)

    if (input === output) {
        output = encodeURIComponent(input)
    }

    document.getElementById("output1").value = output
}
