import DiaryEntryEditForm from "./DiaryEntryEditForm"
import Modal from "./ui/Modal"
import type { DiaryEntry } from "@prisma/client"

export type DiaryEntryEditModalProps = {
    openState: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    editorState: [
        DiaryEntry | null,
        React.Dispatch<React.SetStateAction<DiaryEntry | null>>
    ]
    onSuccess?: () => void
}

const DiaryEntryEditModal: React.FC<DiaryEntryEditModalProps> = ({
    openState,
    editorState,
    onSuccess,
}) => {
    const [, setIsOpen] = openState
    const [editor, setEditor] = editorState

    if (!editor) return null

    return (
        <Modal
            withOpacity={false}
            openState={openState}
            onClose={() => {
                setEditor(null)
                setIsOpen(false)
            }}
        >
            <DiaryEntryEditForm
                diaryId={editor.diaryId}
                diaryEntry={{
                    title: editor.title,
                    content: editor.content,
                }}
                onSuccess={onSuccess}
            />
        </Modal>
    )
}

export default DiaryEntryEditModal
