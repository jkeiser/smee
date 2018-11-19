/* eslint-disable no-console */
import loadjs from 'loadjs'
import LogAction from './logaction.js'
import logAction from './logaction.js';

// These methods are called by gapi.initialize() to resolve the gapi promise
// when gapi.initialize is called
var gapiInitializeResolve
var gapiInitializeReject
export const gapi = new Promise((resolve, reject) => {
    gapiInitializeResolve = resolve
    gapiInitializeReject = reject
})
export default gapi

export class GapiAlreadySigningInOrOutError extends Error {
    constructor(isSigningInOrOut) {
        this.isSigningInOrOut = isSigningInOrOut
        super("Attempt to sign in or out when an existing " + (this.isSigningInOrOut ? "sign in" : "sign out") + " is still underway")
    }
}

/**
 * URL to gapi.js
 */
export const GapiJavaScriptUrl = 'https://apis.google.com/js/api.js'

/**
 * gapi libraries to load by default
 */
export const GapiLibraries = 'client:auth2'

async function loadGapiJavaScript(url) {
    if (window.gapi) {
        console.info("gapi already loaded!")
    } else {
        await LogAction.promise(`loading ${url}`, (resolve, reject) =>
            loadjs(url, resolve, reject)
        )
    }
    return window.gapi
}

/**
 * Load gapi with the given libraries.
 * 
 * @param {string} url - URL to gapi.js
 * @param {string} libraries - A colon (:) separated list of gapi libraries.
 *     Ex: "client:auth2".
 */
async function loadGapi(url, libraries) {
    let gapi = await loadGapiJavaScript(url)
    await LogAction.promise(`loading gapi modules ${libraries}`, (resolve, reject) =>
        gapi.load(libraries, { callback: resolve, onerror: reject })
    )
    return gapi
}

let uninitializedGapi = loadGapi(GapiJavaScriptUrl, GapiLibraries)

/**
 * Initialize the gapi with the given client ID and scope.
 * 
 * May only be called once.
 */
gapi.initialize = async ({ clientId, scope }) => {
    delete gapi.initialize
    try {
        let initializedGapi = await uninitializedGapi
        await initializedGapi.auth2.init({ client_id: clientId, scope: scope.join(' ') })
        await logAction.async(`initializing gapi with client ID ${clientId} and scope ${scope}`, initializedGapi.auth2.init({ client_id: clientId, scope: scope.join(' ') }))
        gapiInitializeResolve(initializedGapi)
    } catch (error) {
        gapiInitializeReject(error)
    }
}
