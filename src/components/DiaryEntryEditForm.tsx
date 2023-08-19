import Button from "./ui/Button"
import OverlayInfo from "./ui/OverlayLoader"
import ShouldRender from "./ui/ShouldRender"
import TextField from "./ui/TextField"
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
import { type DiarySchemes, diarySchemes } from "~/utils/schemes/diary"

type DiaryEntryEditFormProps = {
    diaryId: Diary["id"]
    diaryEntry?: {
        title: string
        content: string
    }
    onSuccess?: () => void
}

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <div>Loading...</div>,
})

const DiaryEntryEditForm: React.FC<DiaryEntryEditFormProps> = (props) => {
    const {
        handleSubmit,
        register,
        setValue,
        watch,
        formState: { errors },
    } = useForm<DiarySchemes["editEntry"]>({
        resolver: zodResolver(diarySchemes.editEntry),
        defaultValues: {
            id: props.diaryId,
            title: props.diaryEntry?.title,
            content: props.diaryEntry?.content,
        },
    })

    const content = watch("content")
    const setContent = (editorState: ReactQuill.Value | undefined) => {
        if (editorState === undefined) return
        if (typeof editorState !== "string") return
        setValue("content", editorState)
    }

    const ctx = api.useContext()

    const editEntryMutation = api.diary.editEntry.useMutation({
        onSuccess: () => {
            void ctx.diary.getById.invalidate({ id: props.diaryId })
            props.onSuccess && props.onSuccess()
        },
    })

    const handleOnValid: SubmitHandler<DiarySchemes["editEntry"]> = (
        data,
        e
    ) => {
        e?.preventDefault()
        editEntryMutation.mutate({
            id: data.id,
            title: data.title,
            content: data.content,
        })
    }

    const handleOnError: SubmitErrorHandler<DiarySchemes["editEntry"]> = (
        data,
        e
    ) => {
        e?.preventDefault()
    }

    return (
        <form
            className="diary-container relative"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={handleSubmit(handleOnValid, handleOnError)}
        >
            <ShouldRender if={editEntryMutation.isLoading}>
                <OverlayInfo message="Saving changes" type="loader" />
            </ShouldRender>
            <TextField
                label="Title"
                errorMsg={errors.title?.message}
                {...register("title")}
            />
            <QuillNoSSRWrapper
                theme="snow"
                value={content}
                onChange={setContent}
            />
            <Button loading={editEntryMutation.isLoading} type="submit">
                Save
            </Button>
        </form>
    )
}

export default DiaryEntryEditForm
