import gremlinconfig from '../../gremlinconfig'

export default class GremlinDB {
    client
    constructor() {
        this.client = import('gremlin').then(gremlin => gremlin.default.createClient(
            443,
            gremlinconfig.endpoint,
            {
                "session": false, 
                "ssl": true, 
                "user": `/dbs/${gremlinconfig.database}/colls/${gremlinconfig.collection}`,
                "password": gremlinconfig.primaryKey,
            }
        ))
    }

    execute(query, params = {}) {
        return new Promise((resolve, reject) => {
            this.client.then(client =>
                client.execute(query, params, (err, results) => {
                    if (err) { reject(err) }
                    else { resolve(results) }
                })
            )
        })
    }
}
