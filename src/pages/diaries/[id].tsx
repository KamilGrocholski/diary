import { type DiaryEntry } from "@prisma/client"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import { AiOutlineFileAdd } from "react-icons/ai"
import { FaTrash } from "react-icons/fa"
import "react-quill/dist/quill.snow.css"
import ConfirmationModal from "~/components/ConfirmationModal"
import DiaryEntryCreateForm from "~/components/DiaryEntryCreateForm"
import DiaryEntryEditForm from "~/components/DiaryEntryEditForm"
import StateWrapper from "~/components/StateWrapper"
import Layout from "~/components/ui/Layout"
import Modal from "~/components/ui/Modal"
import { api } from "~/utils/api"

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <div>Loading</div>,
})

export default function Diary() {
    const ctx = api.useContext()

    const router = useRouter()
    const idFromQuery = router.query.id as string
    const diaryId = parseInt(idFromQuery, 10)

    const diaryQuery = api.diary.getById.useQuery(
        {
            id: diaryId,
        },
        {
            enabled: router.isReady,
        }
    )

    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [isOpenEditor, setIsOpenEditor] = useState<boolean>(false)
    const [editorState, setEditorState] = useState<DiaryEntry | null>(null)

    const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false)

    const [isOpenRemoveEntryModal, setIsOpenRemoveEntryModal] =
        useState<boolean>(false)
    const [removeEntryState, setRemoveEntryState] = useState<DiaryEntry | null>(
        null
    )

    const removeEntryMutation = api.diary.removeEntry.useMutation({
        onSuccess: () => {
            setRemoveEntryState(null)
            setIsOpenRemoveEntryModal(false)
            void ctx.diary.getById.invalidate({ id: diaryId })
        },
    })

    function removeEntry() {
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
                                    className="transition-all duration-150 ease-in-out hover:scale-110 bg-rosePine-iris text-rosePine-base fixed z-50 bottom-8 right-4 rounded-full p-3 flex flex-row text-md items-center gap-1 font-semibold"
                                    onClick={() => setIsOpen(true)}
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
                                    onConfirm={removeEntry}
                                    loading={removeEntryMutation.isLoading}
                                />
                                <Modal
                                    withOpacity={false}
                                    openState={[isOpenEditor, setIsOpenEditor]}
                                    onClose={() => {
                                        setIsOpenEditor(false)
                                        setEditorState(null)
                                    }}
                                >
                                    <DiaryEntryEditForm
                                        diaryId={diaryId}
                                        diaryEntry={{
                                            title: editorState?.title as unknown as string,
                                            content:
                                                editorState?.content as unknown as string,
                                        }}
                                        onSuccess={() => {
                                            setIsOpenEditor(false)
                                            setEditorState(null)
                                        }}
                                    />
                                </Modal>
                                <Modal
                                    withOpacity={false}
                                    openState={[isOpen, setIsOpen]}
                                    onClose={() => {
                                        setIsOpen(false)
                                    }}
                                >
                                    <DiaryEntryCreateForm
                                        diaryId={diary.id}
                                        onSuccess={() => {
                                            setIsOpen(false)
                                        }}
                                    />
                                </Modal>
                                <section className="my-2 flex flex-col gap-1 w-1/2 justify-start">
                                    <h1 className="font-semibold text-2xl">
                                        {diary.title}
                                    </h1>
                                    <p className="text-sm font-thin">
                                        <span>
                                            {formatDate(diary.createdAt)}
                                        </span>
                                    </p>
                                    <p className="text-sm font-thin">
                                        <span>
                                            last update at{" "}
                                            {formatDate(diary.updatedAt)}
                                        </span>
                                    </p>
                                </section>
                                <ul className="flex flex-col gap-4 w-full max-w-3xl">
                                    {diary.entries.map((entry) => (
                                        <EntryCard
                                            key={entry.id}
                                            entry={entry}
                                            openEdit={() => {
                                                setEditorState(entry)
                                                setIsOpenEditor(true)
                                            }}
                                            openRemove={() => {
                                                setIsOpenRemoveEntryModal(true)
                                                setRemoveEntryState(entry)
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

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    weekday: "short",
    month: "short",
})

function formatDate(date: Date): string {
    return dateFormatter.format(date)
}

type EntryCardProps = {
    openEdit: (entry: DiaryEntry) => void
    openRemove: (entry: DiaryEntry) => void
    entry: DiaryEntry
}

const EntryCard: React.FC<EntryCardProps> = ({
    openEdit,
    openRemove,
    entry,
}) => {
    const [dayName, rest] = formatDate(entry.createdAt).split(",") as [
        string,
        string
    ]
    const dayNumber = rest.slice(1, 3)

    return (
        <li className="transition-all ease-in-out duration-100 cursor-pointer rounded-md w-full hover:bg-rosePine-highlightLow bg-rosePine-surface shadow-sm shadow-rosePine-highlightLow">
            <div
                className="flex w-full flex-row gap-3 p-3"
                onClick={() => openEdit(entry)}
            >
                <div className="flex flex-col gap-1 w-16">
                    <span className="flex flex-col bg-rosePine-highlightMed rounded-md px-2 py-1">
                        <span className="text-2xl font-semibold text-center">
                            {dayNumber}
                        </span>
                        <span className="text-center text-sm">{dayName}</span>
                    </span>
                    <button
                        onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            openRemove(entry)
                        }}
                        className="text-rosePine-love mx-auto w-fit"
                    >
                        <FaTrash />
                    </button>
                </div>
                <div className="flex flex-col gap-1 w-full h-fit">
                    <p className="pl-2 text-md font-semibold">{entry.title}</p>
                    <QuillNoSSRWrapper
                        theme="bubble"
                        readOnly
                        value={entry.content}
                    />
                </div>
            </div>
        </li>
    )
}
