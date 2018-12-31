export class GoogleApiEndpoint {
    parent
    constructor(parent) { this.parent = parent }

    get account() { return this.parent.account }
    get resourceUrl() { throw 'Resource URL undefined' }

    async makeRequest(...requestParams) {
        let path = this.resourceUrl
        if (!path) { return null }

        let gapi = await this.googleAccountData.gapiPromise
        let response = await logAction.async(path, gapi.client.request(path, ...requestParams))
        return response
    }
    get lazyGet() {
        Object.defineProperty(this, 'lazyGet', this.makeRequest())
        return this.lazyResponse
    }
}

export class GoogleApiEndpoint {
    constructor(googleAccountData, endpointUrl) { 
    get resourceUrl() { throw 'resourceUrl undefined' }
}

export default class GoogleApiResource extends GoogleApiEndpoint {
    googleAccountData
    parentUrl
    constructor(googleAccountData, parentUrl, baseObject = {}) {
        this.googleAccountData = googleAccountData
        this.parentUrl = parentUrl
        // Copy over everything from the base object
        Object.assign(this, baseObject)
    }

    static ResourceType = new Error('Resource type undefined')
    static ResourceIdField = new Error('Resource id field undefined')

    get resourceUrl() { `${this.parent.resourceUrl}/${this.constructor.ResourceType}/${this[this.constructor.ResourceIdField]}` }
}
