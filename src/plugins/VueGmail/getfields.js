function getFields(fieldNames) {
    let result = {}
    for (let name of fieldNames) {
        result[name] = function() {
            if (this.listedData[name]) { return this.listedData[name] }
            if (!(this.response && this.response.result)) { return null }
            return this.response.result[name]
        }
    }
    return result
}

function buildQueryParams() {
    let queryParams = {}
    for (let name in this.$props.keys) {
        if (name != 'knownData') {
            let value = this[name]
            if (value == null) {
                if (name == 'userId') {
                    queryParams[name] = this.$gapi.currentUser.id
                }
            } else {
                queryParams[name] = value
            }
        }
    }
    return queryParams
}

function buildQueryComponent({
    resource,
    method,
    queryParams = {},
    resultFields = {},
    baseComponent = {}
}) {
    let { props = {}, computed = {}, asyncComputed = {} } = baseComponent
    
    let createdComponent = {
        computed: {
            queryParams: function() {
                let result = {}
                for (let name in queryParams.keys) {
                    let value = [name]
                    if (value == null) {
                        if (name == 'userId') {
                            result[name] = this.$gapi.currentUser.id
                        }
                    } else {
                        result[name] = value
                    }
                }
                return result
            },
            gapiQueryFunction: function() {
                for (let name in )
            }
        },
        asyncComputed: {
            gapiQueryFunction: async function() {
                let gapi = await this.$gapi.gapiPromise
                let queryFunction = gapi.client
                

            },
            response: async function() {
                return await this.$gapi.query('getting label', client => {
                    this.queryParams)
                }
            },
        },
    }
}