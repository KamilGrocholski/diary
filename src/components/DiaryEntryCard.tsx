import type { DiaryEntry } from "@prisma/client"
import dynamic from "next/dynamic"
import { FaTrash } from "react-icons/fa"

const QuillNoSSRWrapper = dynamic(import("react-quill"), {
    ssr: false,
    loading: () => <div>Loading</div>,
})

const dateFormatter = new Intl.DateTimeFormat("pl-PL", {
    day: "2-digit",
    weekday: "short",
    month: "short",
})

function formatDate(date: Date): string {
    return dateFormatter.format(date)
}

export type DiaryEntryCardProps = {
    openEdit: (entry: DiaryEntry) => void
    openRemove: (entry: DiaryEntry) => void
    entry: DiaryEntry
}

const DiaryEntryCard: React.FC<DiaryEntryCardProps> = ({
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

export default DiaryEntryCard
