import { type ButtonHTMLAttributes } from "react"

export type ButtonProps = {
    variant?: keyof typeof variants
    children: React.ReactNode
} & ButtonHTMLAttributes<HTMLButtonElement>

const variants = { primary: "bg-sky-500", secondary: "bg-red-500" } as const

const Button: React.FC<ButtonProps> = (props) => {
    const { variant = "primary", children, ...rest } = props

    const btnClassName = `${variants[variant]}`

    return (
        <button className={btnClassName} {...rest}>
            {children}
        </button>
    )
}

export default Button
