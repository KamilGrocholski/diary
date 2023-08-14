import Link from "next/link"
import StateWrapper from "~/components/StateWrapper"
import { api } from "~/utils/api"

const Diaries = () => {
    const diariesQuery = api.diary.getAll.useQuery()

    return (
        <StateWrapper
            isLoading={diariesQuery.isLoading}
            isError={diariesQuery.isError}
            data={diariesQuery.data}
            NonEmpty={(diaries) => (
                <ul className="">
                    {diaries.map((diary) => (
                        <Link
                            href={`diaries/${diary.id}`}
                            key={diary.id}
                            className="border border-white"
                        >
                            <li>{diary.title}</li>
                        </Link>
                    ))}
                </ul>
            )}
        />
    )
}

export default Diaries
