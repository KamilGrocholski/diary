import type { DiaryEntry } from "@prisma/client"
import type {
    GetServerSidePropsContext,
    InferGetServerSidePropsType,
    NextPage,
} from "next"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useState } from "react"
import { AiOutlineFileAdd } from "react-icons/ai"
import { CiEdit } from "react-icons/ci"
import "react-quill/dist/quill.snow.css"
import DiaryEditForm from "~/components/DiaryEditForm"
import DiaryEntryCard from "~/components/DiaryEntryCard"
import StateWrapper from "~/components/StateWrapper"
import Layout from "~/components/ui/Layout"
import ShouldRender from "~/components/ui/ShouldRender"
import { createSSGHelper } from "~/server/api/utils/ssg"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/utils/api"
import { diaryDateFormatter } from "~/utils/dateFormatters"

const DiaryEntryCreateModal = dynamic(
    import("~/components/DiaryEntryCreateModal"),
    {
        ssr: false,
    }
)
const DiaryEntryEditModal = dynamic(
    import("~/components/DiaryEntryEditModal"),
    {
        ssr: false,
    }
)
const ConfirmationModal = dynamic(import("~/components/ConfirmationModal"), {
    ssr: false,
})

const DiaryPage: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = (props) => {
    const { diaryId } = props

    const ctx = api.useContext()

    const diaryQuery = api.diary.getById.useQuery(
        {
            id: diaryId,
        },
        {
            refetchOnWindowFocus: false,
        }
    )

    const [isOpenCreateEntryModal, setIsOpenCreateEntryModal] =
        useState<boolean>(false)

    const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false)

    const [isEditingDiary, setIsEditingDiary] = useState<boolean>(false)

    const [isOpenRemoveEntryModal, setIsOpenRemoveEntryModal] =
        useState<boolean>(false)
    const [removeEntryState, setRemoveEntryState] = useState<DiaryEntry | null>(
        null
    )

    const [isOpenEditEntryModal, setIsOpenEditEntryModal] =
        useState<boolean>(false)
    const [editEntryState, setEditEntryState] = useState<
        DiaryEntry["id"] | null
    >(null)

    const removeEntryMutation = api.diary.removeEntry.useMutation({
        onSuccess: () => {
            setRemoveEntryState(null)
            setIsOpenRemoveEntryModal(false)
            void ctx.diary.getById.invalidate({ id: diaryId })
        },
    })

    function handleRemoveEntry() {
        if (!removeEntryState) return
        void removeEntryMutation.mutate({ id: removeEntryState.id })
    }

    return (
        <>
            <Layout>
                <StateWrapper
                    isLoading={diaryQuery.isLoading}
                    isError={diaryQuery.isError}
                    data={diaryQuery.data}
                    Empty={
                        <>
                            <Head>
                                <title>Not exists</title>
                            </Head>
                            <div>A diary with id {diaryId} does not exist.</div>
                        </>
                    }
                    NonEmpty={(diary) => (
                        <>
                            <Head>
                                <title>{diary.title}</title>
                            </Head>
                            <div className="diary-container">
                                <button onClick={() => setIsOpenSearch(true)}>
                                    Search
                                </button>
                                <button
                                    className="transition-all duration-150 ease-in-out hover:scale-110 bg-rosePine-iris text-rosePine-base fixed z-50 md:bottom-8 bottom-8 right-4 rounded-full p-3 flex flex-row text-md items-center gap-1 font-semibold"
                                    onClick={() =>
                                        setIsOpenCreateEntryModal(true)
                                    }
                                >
                                    <span>New entry</span>
                                    <AiOutlineFileAdd className="text-2xl" />
                                </button>
                                <ConfirmationModal
                                    openState={[
                                        isOpenRemoveEntryModal,
                                        setIsOpenRemoveEntryModal,
                                    ]}
                                    title={`Remove "${removeEntryState?.title}"`}
                                    onConfirm={handleRemoveEntry}
                                    loading={removeEntryMutation.isLoading}
                                />
                                <DiaryEntryEditModal
                                    openState={[
                                        isOpenEditEntryModal,
                                        setIsOpenEditEntryModal,
                                    ]}
                                    entryId={editEntryState}
                                    onClose={() => {
                                        setEditEntryState(null)
                                    }}
                                />
                                <DiaryEntryCreateModal
                                    openState={[
                                        isOpenCreateEntryModal,
                                        setIsOpenCreateEntryModal,
                                    ]}
                                    diaryId={diaryId}
                                    onSuccess={() =>
                                        setIsOpenCreateEntryModal(false)
                                    }
                                />
                                <section className="my-2 flex flex-col gap-1 w-1/2 justify-start">
                                    <ShouldRender if={!isEditingDiary}>
                                        <div className="flex flex-row items-center gap-1">
                                            <h1 className="font-semibold text-2xl">
                                                {diary.title}
                                            </h1>
                                            <button
                                                onClick={() =>
                                                    setIsEditingDiary(true)
                                                }
                                            >
                                                <CiEdit />
                                            </button>
                                        </div>
                                    </ShouldRender>
                                    <ShouldRender if={isEditingDiary}>
                                        <DiaryEditForm
                                            id={diary.id}
                                            title={diary.title}
                                            onCancel={() =>
                                                setIsEditingDiary(false)
                                            }
                                        />
                                    </ShouldRender>
                                    <div className="text-xs font-thin flex flex-row gap-1">
                                        <span className="italic">
                                            created at
                                        </span>
                                        <span className="font-semibold">
                                            {diaryDateFormatter.format(
                                                diary.createdAt
                                            )}
                                        </span>
                                    </div>
                                    <div className="text-xs font-thin flex flex-row gap-1">
                                        <span className="italic">
                                            last update at
                                        </span>
                                        <span className="font-semibold">
                                            {diaryDateFormatter.format(
                                                diary.updatedAt
                                            )}
                                        </span>
                                    </div>
                                </section>
                                <ShouldRender if={!diary.entries.length}>
                                    <span>This diary has no entries.</span>
                                </ShouldRender>
                                <ul className="flex flex-col gap-4 w-full max-w-3xl">
                                    {diary.entries.map((entry) => (
                                        <DiaryEntryCard
                                            key={entry.id}
                                            entry={entry}
                                            openRemove={() => {
                                                setRemoveEntryState(entry)
                                                setIsOpenRemoveEntryModal(true)
                                            }}
                                            openEdit={() => {
                                                setEditEntryState(entry.id)
                                                setIsOpenEditEntryModal(true)
                                            }}
                                        />
                                    ))}
                                </ul>
                            </div>
                        </>
                    )}
                />
            </Layout>
        </>
    )
}

export default DiaryPage

export async function getServerSideProps(
    context: GetServerSidePropsContext<{ diaryId: string }>
) {
    const { req, res } = context

    const session = await getServerAuthSession({ req, res })

    if (!session?.user) {
        return { redirect: { destination: "/" } }
    }

    const ssg = await createSSGHelper({ req, res })
    const diaryId = parseInt(context.params?.diaryId as unknown as string, 10)

    await ssg.diary.getById.prefetch({ id: diaryId })

    return {
        props: {
            trpcState: ssg.dehydrate(),
            diaryId,
        },
    }
}
