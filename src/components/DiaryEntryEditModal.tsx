import DiaryEntryEditForm from "./DiaryEntryEditForm"
import StateWrapper from "./StateWrapper"
import Modal from "./ui/Modal"
import type { DiaryEntry } from "@prisma/client"
import { api } from "~/utils/api"

export type DiaryEntryEditModalProps = {
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    entryId: DiaryEntry["id"]
    onSuccess?: () => void
}

const DiaryEntryEditModal: React.FC<DiaryEntryEditModalProps> = ({
    openState,
    entryId,
    onSuccess,
}) => {
    const entryQuery = api.diary.getEntryById.useQuery({ id: entryId })

    const [, setIsOpen] = openState

    return (
        <Modal
            withOpacity={false}
            openState={openState}
            onClose={() => {
                setIsOpen(false)
            }}
        >
            <StateWrapper
                data={entryQuery.data}
                isLoading={entryQuery.isLoading}
                isError={entryQuery.isError}
                NonEmpty={(entry) => (
                    <DiaryEntryEditForm
                        diaryId={entry.diaryId}
                        diaryEntry={{
                            title: entry.title,
                            content: entry.content,
                            id: entry.id,
                        }}
                        onSuccess={onSuccess}
                    />
                )}
            />
        </Modal>
    )
}

export default DiaryEntryEditModal
