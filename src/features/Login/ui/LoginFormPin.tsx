import {observer} from "mobx-react";
import {loginStore} from "../model/LoginStore.ts";
import {FormFieldError} from "../../../shared/ui/FormFieldError.tsx";
import {useCallback, useEffect, useRef} from "react";

export const LoginFormPin = observer(() => {
    const pinRef = useRef<HTMLInputElement | null>(null)
    const labelRef = useRef<HTMLLabelElement | null>(null)

    const onPinInput = useCallback(() => {
        loginStore.onPinInput(pinRef.current!.value)
    }, [])

    useEffect(() => {
        loginStore.startTimer()
    }, [])

    const hasPinError = loginStore.errors.pin || loginStore.errors.common

    const getButton = () => {
        if (loginStore.shouldGetNew) {
            return (
                <button
                    className="button"
                    onClick={loginStore.getNew}
                >
                    Get New
                </button>
            )
        }

        if (loginStore.pin.length === 6) {
            return (
                <button
                    type="submit"
                    className="button"
                    disabled={loginStore.disabled || !!hasPinError}
                >
                    {
                        loginStore.loading ? 'Loading...' : 'Continue'
                    }
                </button>
            )
        }

        return null
    }



    return (
        <form onSubmit={loginStore.onPinSubmit} className="">

            <button className="back" onClick={loginStore.back}>
                <img src="/left.png"/>
            </button>

            <div className="login-form_title _m4">
                Two-Factor Authentication
            </div>

            <div className="login-form_subtitle">
                Enter the 6-digit code from the Google Authenticator app
            </div>

            <label className={"form-row pin_wrap" + (hasPinError ? ' __error' : '')}
                   ref={labelRef}
                   onScroll={() => labelRef.current!.scrollLeft = 0}
            >
                <div className="pin_frame"></div>
                <div className="pin_frame"></div>
                <div className="pin_frame"></div>
                <div className="pin_frame"></div>
                <div className="pin_frame"></div>
                <div className="pin_frame"></div>


                <input
                    type="number"
                    name="pin"
                    className="input_pin"


                    value={loginStore.pin}
                    onInput={onPinInput}
                    onBlur={loginStore.onPinBlur}
                    onFocus={loginStore.onPinFocus}
                    ref={pinRef}

                    autoComplete="none"
                />

                <FormFieldError message={loginStore.errors.pin}/>
                <FormFieldError message={loginStore.errors.common}/>
            </label>

            {getButton()}
        </form>
    )
})
