import { zodResolver } from "@hookform/resolvers/zod"
import type { Diary } from "@prisma/client"
import dynamic from "next/dynamic"
import {
    type SubmitErrorHandler,
    type SubmitHandler,
    useForm,
} from "react-hook-form"
import type ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { api } from "~/utils/api"
import { diarySchemes, type DiarySchemes } from "~/utils/schemes/diary"

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <div>Loading</div>,
})

const DiaryEntryCreateForm: React.FC<{
    diaryId: Diary["id"]
    onSuccess: () => void
}> = (props) => {
    const form = useForm<DiarySchemes["addEntry"]>({
        resolver: zodResolver(diarySchemes.addEntry),
        defaultValues: {
            id: props.diaryId,
        },
    })

    const content = form.watch("content")
    const setContent = (editorState: ReactQuill.Value | undefined) => {
        if (editorState === undefined) return
        if (typeof editorState !== "string") return
        form.setValue("content", editorState)
    }

    const ctx = api.useContext()

    const addEntryMutation = api.diary.addEntry.useMutation({
        onSuccess: () => {
            void ctx.diary.getById.invalidate({ id: props.diaryId })
            props.onSuccess()
        },
    })

    const onValid: SubmitHandler<DiarySchemes["addEntry"]> = (data, e) => {
        e?.preventDefault()
        addEntryMutation.mutate({
            id: props.diaryId,
            title: data.title,
            content: data.content,
        })
    }

    const onError: SubmitErrorHandler<DiarySchemes["addEntry"]> = (data, e) => {
        e?.preventDefault()
    }

    return (
        <form
            className="diary-container"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(onValid, onError)}
        >
            <input {...form.register("title")} />
            <QuillNoSSRWrapper
                theme="snow"
                value={content}
                onChange={setContent}
            />
            <button type="submit">Add</button>
        </form>
    )
}

export default DiaryEntryCreateForm
