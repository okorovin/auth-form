import {observer} from "mobx-react";
import {loginStore} from "../model/LoginStore.ts";
import {useCallback, useRef} from "react";
import {FormFieldError} from "../../../shared/ui/FormFieldError.tsx";

export const LoginFormCredentials = observer(() => {
    const emailRef = useRef<HTMLInputElement | null>(null)
    const passwordRef = useRef<HTMLInputElement | null>(null)

    const onEmailInput = useCallback(() => {
        loginStore.onEmailInput(emailRef.current!.value)
    }, [])

    const onPasswordInput = useCallback(() => {
        loginStore.onPasswordInput(passwordRef.current!.value)
    }, [])

    return (
        <form onSubmit={loginStore.onSubmit} className="">

            <div className="login-form_title">
                Sign in to your account to&nbsp;continue
            </div>

            <label className="form-row">
                {/*  чтобы при автокомплите не пропадала иконка */}
                <img src="user.png" className="icon_input" />
                <input
                    type="text"
                    name="email"
                    className="input input_email"
                    placeholder="Email"

                    value={loginStore.email}
                    onInput={onEmailInput}
                    onBlur={loginStore.onEmailBlur}
                    ref={emailRef}
                />

                <FormFieldError message={loginStore.errors.email} />
            </label>

            <label className="form-row">
                {/*  чтобы при автокомплите не пропадала иконка */}
                <img src="lock.png" className="icon_input"/>
                <input
                    type="password"
                    name="password"
                    className="input input_password"
                    placeholder="Password"

                    value={loginStore.password}
                    onInput={onPasswordInput}
                    onBlur={loginStore.onPasswordBlur}
                    ref={passwordRef}
                />

                <FormFieldError message={loginStore.errors.password}/>
            </label>

            <button
                type="submit"
                className="button"
                disabled={loginStore.disabled}
            >
                Continue
            </button>

            <FormFieldError message={loginStore.errors.common}/>
        </form>
    )
})
