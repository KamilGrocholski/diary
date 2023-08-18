import { type DiaryEntry } from "@prisma/client"
import dynamic from "next/dynamic"
import Head from "next/head"
import { useRouter } from "next/router"
import { useState } from "react"
import "react-quill/dist/quill.snow.css"
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

    const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
    const [menuState, setMenuState] = useState<DiaryEntry | null>(null)

    const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false)

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
                            <>
                                <button onClick={() => setIsOpenSearch(true)}>
                                    Search
                                </button>
                                <button
                                    className="transition-all duration-150 ease-in-out hover:scale-110 bg-rosePine-iris text-rosePine-base fixed z-50 bottom-8 right-4 rounded-full p-3"
                                    onClick={() => setIsOpen(true)}
                                >
                                    New entry +
                                </button>
                                <Modal
                                    isOpen={isOpenEditor}
                                    close={() => {
                                        setIsOpenEditor(false)
                                        setEditorState(null)
                                    }}
                                >
                                    <DiaryEntryEditForm
                                        diaryId={
                                            editorState?.diaryId as unknown as number
                                        }
                                        diaryEntry={{
                                            title: editorState?.title as unknown as string,
                                            content:
                                                editorState?.content as unknown as string,
                                        }}
                                    />
                                </Modal>
                                <Modal
                                    isOpen={isOpen}
                                    close={() => {
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
                                <Modal
                                    isOpen={isOpenMenu}
                                    close={() => {
                                        setIsOpenMenu(false)
                                    }}
                                >
                                    <div className="bg-zinc-900 fixed p-3 bottom-0 left-0 right-0 z-50 flex flex-col gap-1">
                                        <button>Remove</button>
                                        <button>Remove</button>
                                        <button>Remove</button>
                                        <button>Remove</button>
                                    </div>
                                </Modal>
                                <section className="my-2 flex flex-col gap-1 w-1/2 justify-start">
                                    <h1 className="font-semibold text-2xl">
                                        {diary.title}
                                    </h1>
                                    <p className="text-sm font-thin">
                                        {formatDate(diary.createdAt)}
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
                                            openMenu={() => {
                                                setMenuState(entry)
                                                setIsOpenMenu(true)
                                            }}
                                        />
                                    ))}
                                </ul>
                            </>
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
    openMenu: (entry: DiaryEntry) => void
    entry: DiaryEntry
}

const EntryCard: React.FC<EntryCardProps> = ({ openEdit, openMenu, entry }) => {
    return (
        <li className="transition-all ease-in-out duration-100 cursor-pointer rounded-md w-full hover:bg-rosePine-highlightLow bg-rosePine-surface shadow-sm shadow-rosePine-highlightLow">
            <div
                className="flex w-full flex-row gap-3 p-3"
                onClick={() => openEdit(entry)}
            >
                <div className="flex flex-col gap-1 w-16">
                    <span className="p-2 rounded-md bg-rosePine-highlightMed">
                        {formatDate(entry.createdAt)}
                    </span>
                </div>
                <div className="flex flex-col gap-1 w-full h-fit">
                    <h1 className="pl-2 text-md font-semibold">
                        {entry.title}
                    </h1>
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
