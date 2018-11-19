/* eslint-disable no-console */

function logAction(actionDescription, action) {
    console.info('Starting ' + actionDescription + ' ...')
    try {
        let result = action()
        console.info('Succeeded ' + actionDescription + '.')
        return result
    } catch (err) {
        console.error('Failed ' + actionDescription + ':')
        console.error(err)
    }
}

async function logActionAsync(actionDescription, promise) {
    console.info('Starting ' + actionDescription + ' ...')
    try {
        let result = await promise
        console.info('Succeeded ' + actionDescription + '.')
        return result
    } catch (err) {
        console.error('Failed ' + actionDescription + ':')
        console.error(err)
    }
}

function logActionPromise(actionDescription, promiseCallback) {
    return new Promise((resolve, reject) =>
        logAction(actionDescription, () => promiseCallback(resolve, reject))
    )
}

function logActionGooglePromise(actionDescription, googlePromise) {
    logActionPromise(actionDescription, (resolve, reject) => googlePromise.then(resolve, reject))
}

logAction.async = logActionAsync
logAction.promise = logActionPromise
logAction.googlePromise = logActionGooglePromise

export default logAction
