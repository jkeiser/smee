export class VueGapiError extends Error {}
export class VueGapiRequiredArgumentError extends VueGapiError {}
export class VueGapiAlreadyInstalledError extends VueGapiError {}
export class VueGapiQueryError {}
export class VueGapiCannotSignInOrOutError extends VueGapiError {
    action
    signInState
    constructor(signInState, action) {
        super(`Cannot ${action} while we are currently ${signInState}!`)
        this.action = action
        this.signInState = signInState
    }
}
