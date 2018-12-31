import Gmail from './GoogleAccountData/Gmail'

export default class GoogleAccountData {
    gapiPromise
    userId
    gmail
    constructor(gapiPromise, userId) {
        this.gapiPromise = gapiPromise
        this.userId = userId
        this.gmail = new Gmail(this)
    }

    get account() { return this }
}

