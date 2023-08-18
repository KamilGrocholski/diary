import Spinner from "./Spinner"

export type OverlayLoaderProps = {
    children?: React.ReactNode
    loadingText?: string
}

const OverlayLoader: React.FC<OverlayLoaderProps> = ({
    children,
    loadingText,
}) => {
    return (
        <div className="absolute inset-0 bg-rosePine-overlay bg-opacity-60 z-10 h-full w-full flex items-center justify-center">
            <div className="flex items-center">
                <span className="text-3xl mr-4">Loading</span>
                <Spinner />
            </div>
        </div>
    )
}

export default OverlayLoader
