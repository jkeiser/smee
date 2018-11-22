/* eslint-disable no-console */
import loadjs from 'loadjs'
import logAction from './logaction.js'

/**
 * URL to gapi.js
 */
export const GapiJavaScriptUrl = 'https://apis.google.com/js/api.js'

/**
 * gapi libraries to load by default
 */
export const GapiLibraries = 'client:auth2'

/**
 * Set global client config
 * 
 * @param clientConfig clientConfig to pass to gapi.client.init()
 */
export function setGapiClientConfig(clientConfig) {
    let resolve = resolveGapiClientConfigPromise
    resolveGapiClientConfigPromise = null
    resolve(clientConfig)
}

/**
 * Loads the GAPI javascript and returns the window.gapi object.
 * 
 * This will take no action if the GAPI JavaScript has already been loaded.
 * 
 * @param {string} url The URL to the GAPI JS.
 * @returns {}
 */
async function loadGapiJavaScript(url) {
    if (window.gapi) {
        console.info("gapi JS already loaded.")
    } else {
        await logAction.promise(`loading ${url}`, (resolve, reject) =>
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
    await logAction.promise(`loading gapi modules ${libraries}`, (resolve, reject) =>
        gapi.load(libraries, { callback: resolve, onerror: reject })
    )
    return gapi
}

var loadedGapi = loadGapi(GapiJavaScriptUrl, GapiLibraries)

// Creates a gapiClientConfig promise that resolves when setGapiClientConfig() is called.
var resolveGapiClientConfigPromise
const gapiClientConfig = new Promise(resolve => { resolveGapiClientConfigPromise = resolve })

async function loadAndInitializeGapi() {
    let gapi = await loadedGapi
    let {clientId,scope,discoveryDocs} = await gapiClientConfig
    scope = scope.join(' ')
    // await Promise.all([
        await logAction.async(
            `initializing gapi.auth2 with client_id ${clientId} and scope ${scope}`,
            gapi.auth2.init({client_id: clientId, scope: scope})
        )
        await logAction.async(
            `initializing gapi.client with discoveryDocs ${discoveryDocs}`,
            gapi.client.init({clientId,scope,discoveryDocs})
        )
        // This next bit is required, else isSignedIn will not be correct.
        await logAction.async(
            `awaiting auth instance initialization`,
            gapi.auth2.getAuthInstance()
        )
    // ])
    return gapi
}

/**
 * Promise that returns a fully loaded and initialized gapi.
 * 
 * This promise is fulfilled when the gapi Javascript, client and auth2
 * libraries have been loaded, *and* gapi.initialize has been called
 * to set the client ID and authorization scope.
 * 
 * @type {Promise}
 */
export const gapiPromise = loadAndInitializeGapi()
export default gapiPromise
