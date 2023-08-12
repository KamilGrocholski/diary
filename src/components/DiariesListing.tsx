import { type DiaryRouterOutputs } from "~/server/api/routers/diary"

export type DiariesListingProps = {
    diaries: DiaryRouterOutputs["getAll"]
}

const DiariesListing: React.FC<DiariesListingProps> = ({ diaries }) => {
    return (
        <ul className="flex flex-col gap-0.5">
            {diaries.map((diary) => (
                <li key={diary.id}>{diary.title}</li>
            ))}
        </ul>
    )
}

export default DiariesListing
