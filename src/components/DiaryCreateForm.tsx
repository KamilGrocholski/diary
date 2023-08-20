import Button from "./ui/Button"
import TextField from "./ui/TextField"
import { zodResolver } from "@hookform/resolvers/zod"
import type { Diary } from "@prisma/client"
import {
    type SubmitErrorHandler,
    type SubmitHandler,
    useForm,
} from "react-hook-form"
import { api } from "~/utils/api"
import { type DiarySchemes, diarySchemes } from "~/utils/schemes/diary"

export type DiaryCreateFormProps = {
    onSuccess: (diaryId: Diary["id"]) => void
}

const DiaryCreateForm: React.FC<DiaryCreateFormProps> = ({ onSuccess }) => {
    const form = useForm<DiarySchemes["create"]>({
        resolver: zodResolver(diarySchemes.create),
    })

    const ctx = api.useContext()

    const createDiaryMutation = api.diary.create.useMutation({
        onSuccess: (data) => {
            void ctx.diary.getAll.invalidate()
            onSuccess && onSuccess(data.id)
        },
    })

    const handleOnValid: SubmitHandler<DiarySchemes["create"]> = (data, e) => {
        e?.preventDefault()
        createDiaryMutation.mutate({ title: data.title })
    }

    const handleOnError: SubmitErrorHandler<DiarySchemes["create"]> = (
        _,
        e
    ) => {
        e?.preventDefault()
    }

    return (
        <form
            className="diary-container relative"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(handleOnValid, handleOnError)}
        >
            <TextField {...form.register("title")} />
            <Button loading={createDiaryMutation.isLoading} type="submit">
                Create diary
            </Button>
        </form>
    )
}

export default DiaryCreateForm
