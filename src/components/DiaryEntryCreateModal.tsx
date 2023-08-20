import DiaryEntryCreateForm from "./DiaryEntryCreateForm"
import Modal from "./ui/Modal"
import type { Diary } from "@prisma/client"

export type DiaryEntryCreateModalProps = {
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    diaryId: Diary["id"]
    onSuccess?: () => void
}

const DiaryEntryCreateModal: React.FC<DiaryEntryCreateModalProps> = ({
    openState,
    diaryId,
    onSuccess,
}) => {
    const [, setIsOpen] = openState

    return (
        <Modal
            withOpacity={false}
            openState={openState}
            onClose={() => {
                setIsOpen(false)
            }}
        >
            <DiaryEntryCreateForm diaryId={diaryId} onSuccess={onSuccess} />
        </Modal>
    )
}

export default DiaryEntryCreateModal
