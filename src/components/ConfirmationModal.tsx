import Button from "./ui/Button"
import Modal from "./ui/Modal"
import ShouldRender from "./ui/ShouldRender"
import { BsExclamationCircleFill } from "react-icons/bs"

export type ConfirmationModalProps = {
    title: string
    description?: string
    confirmationLabel?: string
    onConfirm?: () => void
    onCancel?: () => void
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    icon?: React.ReactNode
    loading?: boolean
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
    title,
    description = "This action is permanent and cannot be undone!",
    confirmationLabel = "Confirm",
    onCancel,
    onConfirm,
    openState,
    icon,
    loading,
}) => {
    const [, setOpen] = openState

    function handleClickCancel() {
        onCancel && onCancel()
        setOpen(false)
    }

    return (
        <Modal
            openState={openState}
            onClose={handleClickCancel}
            hideCloseButton
        >
            <div className="overflow-hidden rounded-lg px-4 pb-4 pt-5 shadow-xl backdrop-blur-sm bg-rosePine-base/80 mx-auto sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:gap-4">
                    <div className="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10">
                        <ShouldRender if={!icon}>
                            <BsExclamationCircleFill
                                size={25}
                                className="text-rosePine-love"
                            />
                        </ShouldRender>

                        <ShouldRender if={icon}>
                            <>{icon}</>
                        </ShouldRender>
                    </div>

                    <div className="text-center sm:text-left">
                        <span className="text-lg font-medium leading-6 text-rosePine-text">
                            {title}
                        </span>
                        <div className="mt-2">
                            <p className="text-sm text-rosePine-subtle">
                                {description}
                            </p>
                        </div>
                    </div>
                </div>
                <div className="mt-5 flex flex-col gap-3 sm:mt-4 sm:flex-row-reverse">
                    <Button
                        loading={loading}
                        onClick={onConfirm}
                        disabled={loading}
                    >
                        {confirmationLabel}
                    </Button>
                    <Button
                        variant="danger"
                        onClick={handleClickCancel}
                        disabled={loading}
                        className="rounded-md"
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </Modal>
    )
}

export default ConfirmationModal
