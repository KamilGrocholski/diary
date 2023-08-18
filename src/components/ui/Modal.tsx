import Button from "./Button"
import Portal from "./Portal"
import ShouldRender from "./ShouldRender"

export type ModalProps = {
    isOpen: boolean
    close: () => void
    children: React.ReactNode
}

const Modal: React.FC<ModalProps> = ({ isOpen, close, children }) => {
    return (
        <ShouldRender if={isOpen}>
            <Portal portalRootId="modal-root">
                <div className="fixed inset-0 h-screen p-3 bg-rosePine-base z-50">
                    <div className="flex flex-col relative pt-4">
                        <Button
                            variant="danger"
                            className="absolute top-0 right-2"
                            onClick={close}
                        >
                            &times;
                        </Button>
                        {children}
                    </div>
                </div>
            </Portal>
        </ShouldRender>
    )
}

export default Modal
