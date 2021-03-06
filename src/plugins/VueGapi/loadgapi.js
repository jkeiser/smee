/* eslint-disable no-console */
import loadjs from 'loadjs'
import logAction from '../../scripts/logaction'

/**
 * URL to gapi.js
 */
export const GapiJavaScriptUrl = 'https://apis.google.com/js/api.js'

/**
 * gapi libraries to load by default
 */
export const GapiLibraries = 'client:auth2'

/**
 * load the GAPI (in a promise)
 */
async function loadGapi() {
    //
    // Load gapi.js
    //
    if (window.gapi) {
        console.info('gapi.js already loaded.')
    } else {
        await logAction.promise(`loading ${GapiJavaScriptUrl}`, (resolve, reject) =>
            loadjs(GapiJavaScriptUrl, resolve, reject)
        )
    }

    //
    // Load and initialize client and auth2 libraries
    //
    let gapi = window.gapi
    await logAction.promise(`loading gapi modules ${GapiLibraries}`, (resolve, reject) =>
        gapi.load(GapiLibraries, { callback: resolve, onerror: reject })
    )
    return gapi
}

export async function initializeGapi({clientId, scope, discoveryDocs}) {
    let gapi = await import('./loadgapi').then(loadgapi => loadgapi.LoadedGapi)
    await logAction.async(
        `initializing gapi.auth2 with client_id ${clientId} and scope ${scope}`,
        gapi.auth2.init({client_id: clientId, scope})
    )
    await logAction.async(
        `initializing gapi.client with clientId ${clientId}, scope ${scope}, and discoveryDocs ${discoveryDocs}`,
        gapi.client.init({ clientId, scope, discoveryDocs })
    )

    return gapi
}

export const LoadedGapi = loadGapi()
export default LoadedGapi