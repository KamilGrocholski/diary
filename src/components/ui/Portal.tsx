import { useEffect, useState } from "react"
import ReactDOM from "react-dom"

export type PortalProps = {
    children: React.ReactNode
    portalRootId?: string
}

function getOrCreateElement(portalRootId: string): HTMLElement {
    let element = document.getElementById(portalRootId)

    if (!element) {
        element = document.createElement("div")
        element.id = portalRootId
    }

    return element
}

const Portal: React.FC<PortalProps> = ({
    children,
    portalRootId = "diary-portal-root",
}) => {
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)

        return () => setIsMounted(false)
    }, [])

    return isMounted
        ? ReactDOM.createPortal(children, getOrCreateElement(portalRootId))
        : null
}

export default Portal
