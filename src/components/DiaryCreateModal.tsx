import DiaryCreateForm from "./DiaryCreateForm"
import Modal from "./ui/Modal"
import type { Diary } from "@prisma/client"

export type DiaryCreateModalProps = {
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    onSuccess: (diaryId: Diary["id"]) => void
}

const DiaryCreateModal: React.FC<DiaryCreateModalProps> = ({
    onSuccess,
    openState,
}) => {
    const [, setIsOpen] = openState

    return (
        <Modal
            openState={openState}
            onClose={() => {
                setIsOpen(false)
            }}
            withOpacity={false}
        >
            <DiaryCreateForm onSuccess={onSuccess} />
        </Modal>
    )
}

export default DiaryCreateModal
