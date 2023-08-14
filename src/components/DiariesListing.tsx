import type { Diary } from "@prisma/client"
import { type DiaryRouterOutputs } from "~/server/api/routers/diary"

export type DiariesListingProps = {
    diaries: DiaryRouterOutputs["getAll"]
    onClick: (diaryId: Diary["id"]) => void
}

const DiariesListing: React.FC<DiariesListingProps> = ({
    diaries,
    onClick,
}) => {
    return (
        <ul className="flex flex-col gap-0.5">
            {diaries.map((diary) => (
                <li onClick={() => onClick(diary.id)} key={diary.id}>
                    {diary.title}
                </li>
            ))}
        </ul>
    )
}

export default DiariesListing
