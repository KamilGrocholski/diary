import { zodResolver } from "@hookform/resolvers/zod"
import {
    type SubmitErrorHandler,
    type SubmitHandler,
    useForm,
} from "react-hook-form"
import { api } from "~/utils/api"
import { type DiarySchemes, diarySchemes } from "~/utils/schemes/diary"

const DiaryCreateForm: React.FC = () => {
    const form = useForm<DiarySchemes["create"]>({
        resolver: zodResolver(diarySchemes.create),
    })

    const ctx = api.useContext()

    const createDiaryMutation = api.diary.create.useMutation({
        onSuccess: () => {
            void ctx.diary.getAll.invalidate()
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
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onSubmit={form.handleSubmit(handleOnValid, handleOnError)}
        >
            <input className="text-black" {...form.register("title")} />
            <button type="submit">Create diary</button>
        </form>
    )
}

export default DiaryCreateForm
