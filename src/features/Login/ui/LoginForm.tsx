import {observer} from "mobx-react";
import "./LoginForm.css"
import {AuthStep, loginStore} from "../model/LoginStore.ts";
import {LoginFormCredentials} from "./LoginFormCredentials.tsx";
import {LoginFormPin} from "./LoginFormPin.tsx";

export const LoginForm = observer(() => {

    const getStep = () => {
        if (loginStore.authStep === AuthStep.PIN) {
            return <LoginFormPin />
        }

        if (loginStore.authStep === AuthStep.SUCCESS) {
            return (
                <div className="login-form_title">
                    Congratulations! <br/> You're amazing!!!
                </div>
            )
        }

        return <LoginFormCredentials />
    }

    return (
        <div className="login-layout">
            <div className="login-layout_logo-box">
                <img src="/logo.png" alt="Company" className="login-layout_logo"/>
            </div>

            {getStep()}
        </div>
    )
})
