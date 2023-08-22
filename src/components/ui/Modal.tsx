import Button from "./Button"
import Portal from "./Portal"
import ShouldRender from "./ShouldRender"
import clsx from "clsx"

export type ModalProps = {
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    onClose?: () => void
    children: React.ReactNode
    hideCloseButton?: boolean
    withOpacity?: boolean
}

const Modal: React.FC<ModalProps> = ({
    withOpacity = true,
    hideCloseButton,
    openState,
    onClose,
    children,
}) => {
    const [open, setOpen] = openState

    const handleClose = () => {
        if (onClose) {
            onClose()
        }
        setOpen(false)
    }

    return (
        <ShouldRender if={open}>
            <Portal portalRootId="modal-root">
                <div
                    className={clsx(
                        withOpacity
                            ? "bg-rosePine-base/50"
                            : "bg-rosePine-base",
                        "fixed inset-0 h-screen p-3 z-50 overflow-y-auto"
                    )}
                >
                    <div className="flex flex-col relative pt-4 h-full">
                        <ShouldRender if={!hideCloseButton}>
                            <Button
                                variant="danger"
                                className="z-50 absolute md:top-0 top-[90%] right-2"
                                onClick={handleClose}
                            >
                                &times;
                            </Button>
                        </ShouldRender>
                        {children}
                    </div>
                </div>
            </Portal>
        </ShouldRender>
    )
}

export default Modal
