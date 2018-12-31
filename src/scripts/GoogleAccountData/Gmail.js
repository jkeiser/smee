import GoogleApiResource from './GooglApiResource'

export default class Gmail extends GoogleApiEndpoint {
    v1
    constructor(parent) {
        super(parent)
        this.v1 = new GmailV1(this)
    }
}

class GmailV1 extends GoogleApiEndpoint {
    ResourceUrl = 'https://www.googleapis.com/gmail/v1'

    users
    constructor(parent) {
        super(parent);
        this.users = new Users(this)
    }

    get resourceUrl() { return this.constructor.ResourceUrl }
}

export const Gmail = GoogleApiEndpoint.api(account => ({
    'https://www.googleapis.com/gmail/v1',
    {
        users: {
            me: parent => ({
                userId: parent.userId,
                
            })
        }
    }
)})
export default Gmail

class Users extends GoogleApiEndpoint {
    get me() {
        return new User(this, { userId: this.account.userId })
    }
}

class User extends GoogleApiResource {
    static ResourceType = 'users'
    static ResourceIdName = 'userId'
}

export default class Gmail extends GoogleAccountObject {
    query(resourcePath, methodName, parameters={}) {
        if (!this.userId) { return null }
        parameters = Object.assign({ userId: this.userId }, parameters)
        return this.query(resourcePath, methodName, parameters)
    }

    get userId() {
        return this.googleAccountData.userId
    }

    get profile() {
        return this.lazyProperty('profile', this.query('gmail.users', 'getProfile').then(p => new Profile(p)))
    }
    get settings() {
        return this.lazyProperty('settings', new Settings())
    }
    get drafts() {
        return this.lazyList('drafts', Label, this.query('gmail.users.drafts', 'list'))
    }
    get history() {
        return this.lazyList('history', History, this.query('gmail.users.history', 'list'))
    }
    get labels() {
        return this.lazyList('labels', Label, this.query('gmail.users.labels', 'list'))
    }
    get messages() {
        return this.lazyList('messages', Message, this.query('gmail.users.messages', 'list'))
    }
    get threads() {
        return this.lazyList('threads', Thread, this.query('gmail.users.threads', 'list'))
    }

    get url() {
        `https://www.googleapis.com/gmail/v1/users/${this.account.userId}`
    }

    static resourceClass(resourceName) {
        return class {
            get query() {

            }
            get url() {
                return `${this.gmail.url}/${resourceName}`
            }
            get id() {

            }
        }
    }
}

export 

export class Label extends GoogleAccountObject {
}

export class Message extends GoogleAccountObject {
}

export class Profile extends GoogleAccountObject {
}

export class Settings extends GoogleAccountObject {
    get autoForwarding() {
        return this.lazyProperty('autoForwarding', this.query('gmail.users.settings', 'getAutoForwarding'))
    }
    get delegates() {
        return this.lazyList('delegates', GoogleAccountObject, this.query('gmail.users.settings.delegates', 'list'))
    }
    get filters() {
        return this.lazyList('filters', GoogleAccountObject, this.query('gmail.users.settings.filters', 'list'))
    }
    get forwardingAddresses() {
        return this.lazyList('forwardingAddresses', GoogleAccountObject, this.query('gmail.users.settings.forwardingAddresses', 'list'))
    }
    get imap() {
        return this.lazyProperty('imap', this.query('gmail.users.settings', 'getImap'))
    }
    get pop() {
        return this.lazyProperty('pop', this.query('gmail.users.settings', 'getPop'))
    }
    get sendAs() {
        return this.lazyList('sendAs', SendAsSetting, this.query('gmail.users.settings.sendAs', 'list'))
    }
    get vacation() {
        return this.lazyProperty('vacation', this.query('gmail.users.settings', 'getVacation'))
    }
}

export class SendAsSetting extends GoogleAccountObject {
    get smimeInfo() {
        return this.lazyList('smimeInfo', GoogleAccountObject, this.query('gmail.users.settings.smimeInfo', 'list', { 'sendAsEmail': this.sendAsEmail }))
    }
}

export class Thread extends GoogleAccountObject {
    get messages() {
        return this.lazyList('messages', Message, this.query('gmail.users.threads', 'get', { id: this.id, fields: 'messages' }))
    }
}
