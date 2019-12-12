/**
 * restx.js - send rest request in js version
 *
 * @author xia xiongjun
 *
 * - v1.0.0 (2019/10/03)
 *  - support localStorage['x-debug-mode'] = '1' to show detail stack info
 * - v1.1.0 (2019/10/28)
 *  - expose addRequestTime2Url
 */

'use strict';

let rest = (function() {
    let onStart = null;
    let onDone = null;
    let debugMode = false;

    /**
     * init rest to set common onStart and onDone, for example to show ro hide buzy status indicator
     *
     * @param {Object}      [params]
     * @param {Function}    params.onStart
     * @param {Function}    params.onDone
     */
    function init(params) {
        onStart = params.onStart;
        onDone = params.onDone;
        debugMode = (localStorage['x-debug-mode'] === '1')

        console.info("To show request origin, use \n    localStorage['x-debug-mode'] = '1'\n")
    }

    function onError(xhr) {
        console.error(xhr);
    }

    function createRequest(method, url) {
        let xhr = new XMLHttpRequest();

        if (method != "GET") {
            xhr.open(method, url);
        } else {
            xhr.open(method, addRequestTime2Url(url));
        }

        return xhr;
    }

    // add req_time to disable browser cache
    function addRequestTime2Url(url) {
        // do not add to php request
        if (getFileExtension(getUrlBaseName(url)) === 'php') {
            return url;
        }

        let reqTime = 'req_time=' + (new Date()).getTime();

        if (url.indexOf("?") > -1) {
            return url + "&" + reqTime;
        } else {
            return url + "?" + reqTime;
        }
    }

    // SEE: https://stackoverflow.com/a/27800498/1440174
    function getUrlBaseName(url) {
        return url ? url.split('/').pop().split('#').shift().split('?').shift() : null
    }

    // SEE: https://stackoverflow.com/a/190933/1440174
    function getFileExtension(filename) {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];
    }

    /**
     * send rest request
     *
     * @param {string}      method                  - 'GET', 'POST', 'PUT', 'DELETE'
     * @param {string}      url                     -
     * @param {Object}      [params]                -
     * @param {Object}      params.headers          -
     * @param {Object}      params.noEncodeHeaders  - do not encode headers
     * @param {Blob}        params.content          -
     * @param {Object}      params.data             - data to send as form data
     * @param {string}      params.responseType     -
     * @param {Function}    params.onOK             -
     * @param {Function}    params.onError          -
     */
    function request(method, url, params) {
        onStart && onStart();

        let xhr = createRequest(method, url);

        for (let key in params.headers) {
            let value = params.noEncodeHeaders ? params.headers[key] : encodeURIComponent(params.headers[key]);
            xhr.setRequestHeader(key, value);
        }

        if (params.responseType) {
            xhr.responseType = params.responseType;
        }

        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4) {
                onDone && onDone();

                if (xhr.status == 200) {
                    params.onOK && params.onOK(xhr);
                } else {
                    params.onError ? params.onError(xhr) : onError(xhr);
                }
            }
        };

        if (debugMode) {
            console.warn(method + " " + url);
        } else {
            console.info(method + " " + url);
        }

        if (params.data) {
            // SEE: https://developer.mozilla.org/en-US/docs/Web/API/FormData/Using_FormData_Objects
            let formData = new FormData();

            Object.keys(params.data).forEach(function(key) {
                let value = params.data[key];

                if (value instanceof Blob) {
                    formData.append(key, value, key);
                } else {
                    formData.append(key, value);
                }
            });

            xhr.send(formData);
        } else {
            xhr.send(params.content);
        }
    }

    function get(url, params) {
        request("GET", url, params);
    }

    function post(url, params) {
        request("POST", url, params);
    }

    function put(url, params) {
        request("PUT", url, params);
    }

    function _delete(url, params) {
        request("DELETE", url, params);
    }

    return {
        init: init,
        createRequest: createRequest,
        addRequestTime2Url: addRequestTime2Url,
        request: request,
        get: get,
        post: post,
        put: put,
        delete: _delete
    };
})();
