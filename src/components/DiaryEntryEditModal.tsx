import DiaryEntryEditForm from "./DiaryEntryEditForm"
import StateWrapper from "./StateWrapper"
import Modal from "./ui/Modal"
import type { DiaryEntry } from "@prisma/client"
import { api } from "~/utils/api"

export type DiaryEntryEditModalProps = {
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    entryId: DiaryEntry["id"] | null
    onClose: () => void
}

const DiaryEntryEditModal: React.FC<DiaryEntryEditModalProps> = ({
    openState,
    entryId,
    onClose,
}) => {
    const entryQuery = api.diary.getEntryById.useQuery(
        { id: entryId as unknown as number },
        { enabled: entryId !== null }
    )

    return (
        <Modal withOpacity={false} openState={openState} onClose={onClose}>
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
                            date: entry.date,
                        }}
                    />
                )}
            />
        </Modal>
    )
}

export default DiaryEntryEditModal
