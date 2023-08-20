import {
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
    type NextPage,
} from "next"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { FaTrash } from "react-icons/fa"
import ConfirmationModal from "~/components/ConfirmationModal"
import DiaryCreateModal from "~/components/DiaryCreateModal"
import StateWrapper from "~/components/StateWrapper"
import Button from "~/components/ui/Button"
import Layout from "~/components/ui/Layout"
import { createSSGHelper } from "~/server/api/utils/ssg"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/utils/api"

const DiariesPage: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = (_props) => {
    const router = useRouter()

    const ctx = api.useContext()

    const diariesQuery = api.diary.getAll.useQuery()
    const removeDiaryMutation = api.diary.remove.useMutation({
        onSuccess: () => {
            setRemoveDiaryState(null)
            setIsRemoveDiaryModalOpen(false)
            void ctx.diary.getAll.invalidate()
        },
    })

    const [isCreateDiaryModalOpen, setIsCreateDiaryModalOpen] =
        useState<boolean>(false)

    const [isRemoveDiaryModalOpen, setIsRemoveDiaryModalOpen] =
        useState<boolean>(false)
    const [removeDiaryState, setRemoveDiaryState] = useState<{
        title: string
        id: number
    } | null>(null)

    function removeDiary() {
        if (!removeDiaryState) return
        void removeDiaryMutation.mutate({ id: removeDiaryState.id })
    }

    return (
        <Layout>
            <ConfirmationModal
                openState={[isRemoveDiaryModalOpen, setIsRemoveDiaryModalOpen]}
                title={`Remove ${removeDiaryState?.title}`}
                loading={removeDiaryMutation.isLoading}
                onConfirm={removeDiary}
                onCancel={() => {
                    setRemoveDiaryState(null)
                    setIsRemoveDiaryModalOpen(false)
                }}
            />
            <DiaryCreateModal
                openState={[isCreateDiaryModalOpen, setIsCreateDiaryModalOpen]}
                onSuccess={(diaryId) => {
                    void router.push(`/diaries/${diaryId}`)
                }}
            />
            <Button
                onClick={() => {
                    setIsCreateDiaryModalOpen(true)
                }}
            >
                New diary
            </Button>
            <StateWrapper
                isLoading={diariesQuery.isLoading}
                isError={diariesQuery.isError}
                data={diariesQuery.data}
                NonEmpty={(diaries) => (
                    <ul className="">
                        {diaries.map((diary) => (
                            <li key={diary.id}>
                                <Link
                                    href={`diaries/${diary.id}`}
                                    className="border border-white"
                                >
                                    <span>{diary.title}</span>
                                </Link>
                                <button
                                    onClick={() => {
                                        setRemoveDiaryState(diary)
                                        setIsRemoveDiaryModalOpen(true)
                                    }}
                                >
                                    <FaTrash />
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            />
        </Layout>
    )
}

export default DiariesPage

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    const session = await getServerAuthSession({ req, res })

    if (!session?.user) {
        return { redirect: { destination: "/" } }
    }

    const ssg = await createSSGHelper({ req, res })
    await ssg.diary.getAll.prefetch()

    return {
        props: {
            user: session.user,
        },
    }
}
