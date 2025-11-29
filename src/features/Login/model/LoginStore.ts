import {makeAutoObservable} from "mobx";
import React from "react";
import EmailValidator from "../../../shared/lib/EmailValidator.ts";


export enum AuthStep {
    CREDENTIALS,
    PIN,
    SUCCESS
}

enum Errors {
    WRONG_CREDENTIALS ='WRONG_CREDENTIALS',
    WRONG_CODE ='WRONG_CODE'
}

interface Result {
    success: boolean,
    error?: Errors
}

const results = [
    {
        success: true,
    },
    {
        success: false,
        error: Errors.WRONG_CREDENTIALS
    },

    {
        success: false,
        error: Errors.WRONG_CODE
    },
]

let e = false

const TIMEOUT = 30 // сек

const validator = new EmailValidator()
    .setEmailLengthConstraint(2)

export class LoginStore {

    authStep: AuthStep = AuthStep.CREDENTIALS

    email = ''

    password = ''

    pin = ''

    errors = {
        email: '',
        password: '',
        pin: '',
        common: ''
    }

    disabled = true


    timer: number | null = null

    shouldGetNew = false

    loading = false;

    constructor() {
        makeAutoObservable(this)
    }


    setDisabled(disabled: boolean) {
        this.disabled = disabled;
    }


    setAuthStep(authStep: AuthStep) {
        this.authStep = authStep;
    }

    onEmailInput = (val: string) => {
        this.email = val
        this.errors.email = ''
        this.validateCredentials()
    }

    onEmailBlur = () => {
        this.checkEmail();
        this.validateCredentials()
    }

    onPasswordInput = (val: string) => {
        this.password = val;
        this.errors.password = ''
        this.validateCredentials()
    }

    onPasswordBlur = () => {
        this.checkPassword()
        this.validateCredentials()
    }




    checkEmail() {
        if (this.email) {

            if (!validator.isValid(this.email)) {
                this.errors.email = 'Wrong email'
            }

        } else {
            this.errors.email = 'Please fill email'
        }
    }


    checkPassword() {
        if (!this.password) {
            this.errors.password = 'Please fill password'
        }
    }

    validateCredentials = () => {
        this.disabled = false;


        if (this.hasErrors()) {
            this.disabled = true;
        }

        if (!this.email || !this.password) {
            this.disabled = true;
        }
    }

    hasErrors() {
        return !!Object.values(this.errors).find(Boolean)
    }

    onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        this.errors.common = ''

        this.checkEmail();

        this.validateCredentials()

        this.sendCredentials();
    }


    async sendCredentials() {
        if (this.disabled) {
            return;
        }

        this.setDisabled(true);
        this.setLoading(true);

        try {
            const res = await new Promise<Result>((resolve) => {
                setTimeout(() => {
                    e = !e;
                    // типа моки
                    resolve(results[e ? 1 : 0])
                }, 1000)
            })

            if (res.success) {
                this.setAuthStep(AuthStep.PIN);
                e = false;
            } else {
                this.processApiError(res.error || '')
            }
        } catch (e) {
            this.processApiError('Api error ' + (e as Error).message)
        } finally {
            this.setDisabled(false);
            this.setLoading(false);
        }
    }

    processApiError(error: Errors | string) {
        if (error === Errors.WRONG_CREDENTIALS) {
            this.errors.common = 'Wrong creadentials';
            return;
        }
        if (error === Errors.WRONG_CODE) {
            this.errors.common = 'Invalid code';
            return;
        }

        this.errors.common = error;
    }

    back = () => {
        this.authStep = AuthStep.CREDENTIALS;
        loginStore.errors.pin = ''
        loginStore.errors.common = ''
    }


    onPinInput = (val: string) => {
        console.log('val', val);
        this.pin = val.trim().replace(/\D/gi, '').substring(0,6)


        this.errors.pin = ''

        loginStore.disabled = false;
    }

    onPinBlur = () => {

    }
    onPinFocus = () => {
        this.pin = ''
        this.errors.pin = ''
        this.errors.common = ''
    }

    startTimer() {
        this.stopTimer();

        this.shouldGetNew = false;

        this.timer = setTimeout(() => {
            this.shouldGetNew = true;
        }, TIMEOUT * 1000)
    }


    stopTimer() {
        if (this.timer) {
            clearTimeout(this.timer)
            this.timer = null
        }
    }

    getNew = () => {
        // чототам делаем

        this.startTimer()
    }

    onPinSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        this.errors.common = '';


        if (this.pin.length !== 6) {
            this.disabled = false;
            return;
        }

        this.sendPin();
    }


    async sendPin() {
        if (this.disabled) {
            return;
        }

        this.setDisabled(true)

        this.setLoading(true)

        try {
            const res = await new Promise<Result>((resolve) => {
                setTimeout(() => {
                    e = !e;
                    // типа моки
                    resolve(results[e ? 2 : 0])
                }, 1000)
            })

            if (res.success) {
                this.setAuthStep(AuthStep.SUCCESS)
            } else {
                this.processApiError(res.error || '')
            }
        } catch (e) {
            this.processApiError('Api error ' + (e as Error).message)
        } finally {
            this.setDisabled(false)
            this.setLoading(false)
        }
    }


    setLoading(loading: boolean) {
        this.loading = loading
    }
}


export const loginStore = new LoginStore()
