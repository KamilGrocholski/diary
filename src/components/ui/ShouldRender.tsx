export type ShouldRenderProps = {
    if: unknown
    children: React.ReactElement
}

const ShouldRender: React.FC<ShouldRenderProps> = ({
    children,
    if: condition,
}) => {
    if (condition) return children
    return null
}

export default ShouldRender
