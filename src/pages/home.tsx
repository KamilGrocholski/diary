import {
    type InferGetServerSidePropsType,
    type GetServerSidePropsContext,
    type NextPage,
} from "next"
import Link from "next/link"
import ActivityCalendar, { type ThemeInput } from "react-activity-calendar"
import StateWrapper from "~/components/StateWrapper"
import Layout from "~/components/ui/Layout"
import { createSSGHelper } from "~/server/api/utils/ssg"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/utils/api"

const explicitTheme: ThemeInput = {
    light: ["#f0f0f0", "#c4edde", "#7ac7c4", "#f73859", "#384259"],
    dark: ["#383838", "#4D455D", "#7DB9B6", "#F5E9CF", "#E96479"],
}

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
    _props
) => {
    const diariesQuery = api.diary.getAll.useQuery()

    return (
        <Layout>
            <ActivityCalendar
                data={[
                    { level: 0, count: 0, date: "2023-01-01" },
                    { level: 1, count: 2, date: "2023-01-22" },
                    { level: 1, count: 2, date: "2023-03-22" },
                    { level: 1, count: 2, date: "2023-02-22" },
                    { level: 0, count: 0, date: "2023-12-31" },
                ]}
                theme={explicitTheme}
            />
            <StateWrapper
                isLoading={diariesQuery.isLoading}
                isError={diariesQuery.isError}
                data={diariesQuery.data}
                Empty={<div>You have no diaries.</div>}
                NonEmpty={(diaries) => (
                    <ul>
                        {diaries.map((diary) => (
                            <Link key={diary.id} href={`/diaries/${diary.id}`}>
                                <li>{diary.title}</li>
                            </Link>
                        ))}
                    </ul>
                )}
            />
        </Layout>
    )
}

export default Home

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    const session = await getServerAuthSession({ req, res })

    if (!session?.user) {
        return {
            redirect: {
                destination: "/",
            },
        }
    }

    const ssg = await createSSGHelper({ req, res })
    await ssg.diary.getAll.prefetch()

    return {
        props: {
            user: session.user,
        },
    }
}
