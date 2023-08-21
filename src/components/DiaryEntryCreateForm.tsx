import Button from "./ui/Button"
import CalendarField from "./ui/CalendarField"
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
    Controller,
} from "react-hook-form"
import type ReactQuill from "react-quill"
import "react-quill/dist/quill.snow.css"
import { createEntryContentPlaceholder } from "~/const/config"
import { api } from "~/utils/api"
import { diarySchemes, type DiarySchemes } from "~/utils/schemes/diary"

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <div>Loading</div>,
})

const DiaryEntryCreateForm: React.FC<{
    diaryId: Diary["id"]
    onSuccess?: () => void
}> = (props) => {
    const form = useForm<DiarySchemes["addEntry"]>({
        resolver: zodResolver(diarySchemes.addEntry),
        defaultValues: {
            id: props.diaryId,
            date: new Date(),
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
            props.onSuccess && props.onSuccess()
        },
    })

    const onValid: SubmitHandler<DiarySchemes["addEntry"]> = (data, e) => {
        e?.preventDefault()
        addEntryMutation.mutate({
            id: props.diaryId,
            title: data.title,
            content: data.content,
            date: data.date,
        })
    }

    const onError: SubmitErrorHandler<DiarySchemes["addEntry"]> = (
        _data,
        e
    ) => {
        e?.preventDefault()
    }

    return (
        <form
            className="diary-container relative"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(onValid, onError)}
        >
            <ShouldRender if={addEntryMutation.isLoading}>
                <OverlayInfo message="Creating an entry" type="loader" />
            </ShouldRender>
            <TextField
                label="Title"
                errorMsg={form.formState.errors.title?.message}
                {...form.register("title")}
            />
            <Controller
                control={form.control}
                name="date"
                render={({ field }) => (
                    <CalendarField
                        onChange={(date) => field.onChange(date)}
                        value={field.value}
                    />
                )}
            />
            <QuillNoSSRWrapper
                theme="snow"
                value={content}
                placeholder={createEntryContentPlaceholder}
                onChange={setContent}
            />
            <Button loading={addEntryMutation.isLoading} type="submit">
                Add
            </Button>
        </form>
    )
}

export default DiaryEntryCreateForm
