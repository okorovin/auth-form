import {memo, type FC} from "react";

interface IFormFieldErrorProps {
    message?: string
}

export const FormFieldError: FC<IFormFieldErrorProps> = memo(({message}) => {
    if (!message) {
        return
    }

    return (
        <div className="error-message">
            {message}
        </div>
    )
})
