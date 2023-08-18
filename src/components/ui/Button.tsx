import clsx from "clsx"
import { type ButtonHTMLAttributes } from "react"

export type ButtonProps = {
    variant?: keyof typeof variants
    size?: keyof typeof sizes
    shape?: keyof typeof shapes
    children: React.ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const variants = {
    primary: "bg-rosePine-foam text-rosePine-base",
    secondary: "bg-rosePine-foam text-rosePine-base",
    danger: "bg-rosePine-love text-rosePine-base",
} as const

const shapes = {
    square: "",
    round: "rounded-md",
} as const

const sizes = {
    base: "py-1 px-2",
} as const

const Button: React.FC<ButtonProps> = (props) => {
    const {
        variant = "primary",
        size = "base",
        type = "button",
        shape = "round",
        children,
        className,
        ...rest
    } = props

    const baseClassName = "transition-all duration-100 ease-in-out"

    const btnClassName = clsx(
        shapes[shape],
        variants[variant],
        sizes[size],
        className,
        baseClassName
    )

    return (
        <button type={type} className={btnClassName} {...rest}>
            {children}
        </button>
    )
}

export default Button
