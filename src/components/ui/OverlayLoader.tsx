import ShouldRender from "./ShouldRender"
import Spinner from "./Spinner"

export type OverlayInfoProps = {
    message: string
    type: keyof typeof types
}

const types = {
    info: "",
    error: "",
    warning: "",
    loader: "",
    success: "",
} as const

const OverlayInfo: React.FC<OverlayInfoProps> = ({ message, type }) => {
    return (
        <div className="fixed inset-0 bg-rosePine-overlay bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
            <div className="flex items-center">
                <span className="text-3xl mr-4">{message}</span>
                <ShouldRender if={type === "loader"}>
                    <Spinner />
                </ShouldRender>
            </div>
        </div>
    )
}

export default OverlayInfo
