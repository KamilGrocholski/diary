import TextField from "./ui/TextField"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Diary } from "@prisma/client"
import {
    type SubmitErrorHandler,
    type SubmitHandler,
    useForm,
} from "react-hook-form"
import { AiOutlineCheck } from "react-icons/ai"
import { LiaTimesSolid } from "react-icons/lia"
import { api } from "~/utils/api"
import { diarySchemes, type DiarySchemes } from "~/utils/schemes/diary"

export type DiaryEditFormProps = {
    id: Diary["id"]
    title: Diary["title"]
    onSuccess: () => void
    onCancel: () => void
}

const DiaryEditForm: React.FC<DiaryEditFormProps> = (props) => {
    const form = useForm<DiarySchemes["edit"]>({
        resolver: zodResolver(diarySchemes.edit),
        defaultValues: {
            id: props.id,
            title: props.title,
        },
    })

    const ctx = api.useContext()

    const editDiaryMutation = api.diary.edit.useMutation({
        onSuccess: () => {
            void ctx.diary.getById.invalidate({ id: props.id })
            props.onSuccess()
        },
    })

    const handleOnValid: SubmitHandler<DiarySchemes["edit"]> = (data, e) => {
        e?.preventDefault()
        editDiaryMutation.mutate({
            id: data.id,
            title: data.title,
        })
    }

    const handleOnError: SubmitErrorHandler<DiarySchemes["edit"]> = (
        _data,
        e
    ) => {
        e?.preventDefault()
    }

    return (
        <form
            className="flex flex-row gap-1 items-center"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(handleOnValid, handleOnError)}
        >
            <TextField {...form.register("title")} />
            <button
                disabled={editDiaryMutation.isLoading}
                className="text-rosePine-pine"
                type="submit"
            >
                <AiOutlineCheck />
            </button>
            <button
                disabled={editDiaryMutation.isLoading}
                onClick={props.onCancel}
                type="button"
                className="text-rosePine-love"
            >
                <LiaTimesSolid />
            </button>
        </form>
    )
}

export default DiaryEditForm
