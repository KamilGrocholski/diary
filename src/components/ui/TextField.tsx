import { forwardRef, type InputHTMLAttributes } from "react"

export type TextFieldProps = {
    errorMsg?: string
    label?: string
} & InputHTMLAttributes<HTMLInputElement>

const TextField = forwardRef<HTMLInputElement, TextFieldProps>((props, ref) => {
    const { label, errorMsg, ...rest } = props

    return (
        <label className="flex flex-col gap-0.5">
            {label ? label : null}
            <input
                className="px-2 py-1.5 border border-rosePine-highlightHigh bg-rosePine-surface text-rosePine-text"
                {...rest}
                ref={ref}
            />
            <span className="text-rosePine-love text-sm">
                {errorMsg ? errorMsg : null}
            </span>
        </label>
    )
})

TextField.displayName = "TextField"

export default TextField
