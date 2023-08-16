import clsx from "clsx"
import { type ButtonHTMLAttributes } from "react"

export type ButtonProps = {
    variant?: keyof typeof variants
    size?: keyof typeof sizes
    children: React.ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const variants = {
    primary: "bg-sky-500",
    secondary: "bg-white",
    danger: "bg-red-500",
} as const

const sizes = {
    base: "py-1 px-2",
} as const

const Button: React.FC<ButtonProps> = (props) => {
    const {
        variant = "primary",
        size = "base",
        children,
        className,
        ...rest
    } = props

    const btnClassName = clsx(variants[variant], sizes[size], className)

    return (
        <button className={btnClassName} {...rest}>
            {children}
        </button>
    )
}

export default Button
