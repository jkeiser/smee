import idb from 'idb';

export const VERSION = 1

export class SimpleIDB {
    db
    constructor(db) {
        this.db = db
    }
    async getAll(objectStoreName, ...params) {
        let db = await this.db
        let tx = db.transaction(objectStoreName)
        let objectStore = tx.objectStore(objectStoreName)
        return await objectStore.getAll(...params)
    }
    async get(objectStoreName, ...params) {
        let db = await this.db
        let tx = db.transaction(objectStoreName)
        let objectStore = tx.objectStore(objectStoreName)
        return await objectStore.get(...params)
    }
    async put(objectStoreName, ...params) {
        let db = await this.db
        let tx = db.transaction(objectStoreName, 'readwrite')
        let objectStore = tx.objectStore(objectStoreName)
        await objectStore.put(...params)
    }
}

function createDb() {
    return idb.open('account-data', VERSION, upgradeDB => {
        // User: { linkedAccounts }
        let user = upgradeDB.createObjectStore('user')
        user.add({ linkedAccounts: [] })

        // Concerns: {
        //     concernId, name, image,
        //     importance, urgency, action,
        // }
        let concerns = upgradeDB.createObjectStore('concerns', { keyPath: 'concernId' })
        concerns.createIndex('parentConcerns', 'concerns', { multiEntry: true })

        // People: {
        //     personId, name, image,
        //     relevance: { importance, urgency, action, concerns[] },
        // }
        let people = upgradeDB.createObjectStore('people', { keyPath: 'personId', })
        people.createIndex('concerns', 'relevance.concerns', { multiEntry: true })

        // Accounts: {
        //     accountId, uri, personId, emails, profileName, profileImage,
        //     relevance: { importance, urgency, action, concerns[] },
        // }
        let accounts = upgradeDB.createObjectStore('accounts', { keyPath: 'accountId', autoIncrement: true })
        accounts.createIndex('uri', 'uri', { unique: true })
        accounts.createIndex('emails', 'emails', { multiEntry: true })
        accounts.createIndex('concerns', 'relevance.concerns', { multiEntry: true })

        // Threads: {
        //     threadId, accountId,
        //     relevance: { importance, urgency, action, concerns[] },
        // }
        let threads = upgradeDB.createObjectStore('threads', { keyPath: 'threadId', })
        threads.createIndex('concerns', 'relevance.concerns', { multiEntry: true })

        // Messages: {
        //   messageId, accountId, threadId,
        //   relevance: { urgency, action, concerns[] },
        //   message: { from[], to[], cc[], bcc[], subject, sent, received, snippet }
        // }
        let messages = upgradeDB.createObjectStore('messages', { keyPath: [ 'accountId', 'id' ] })
        messages.createIndex('received', 'email.received')
        messages.createIndex('concerns', 'relevance.concerns', { multiEntry: true })
    })
}

export default class AccountDB extends SimpleIDB {
    constructor() {
        super(createDb())
    }

    async user() {
        let users = await this.db.getAll('user')
        return users[0]
    }

    async addGoogleAccount(user) {
        let account = {
            accountUri: `google:${user.id}`,
            user
        }
        await this.db.put('accounts', account)
        return new Account(this, account)
    }

    async getGoogleAccount(userId) {
        return new Account(this, this.db.get('accounts', `google:${userId}`, ))
    }
}

class Account {
    data
    constructor(data) { this.data = data }
    async addEmails(emails) {
        for (let email of emails) {
            
        }
    }
    async emailsBySender() {

    }
}

export class EmailGroup {
    sender
    constructor(sender) {

    }
}

export class Email {
    id
    threadId
}

