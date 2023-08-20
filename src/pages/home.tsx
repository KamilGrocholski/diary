import {
    type InferGetServerSidePropsType,
    type GetServerSidePropsContext,
    type NextPage,
} from "next"
import Link from "next/link"
import StateWrapper from "~/components/StateWrapper"
import Layout from "~/components/ui/Layout"
import { createSSGHelper } from "~/server/api/utils/ssg"
import { getServerAuthSession } from "~/server/auth"
import { api } from "~/utils/api"

const Home: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
    _props
) => {
    const diariesQuery = api.diary.getAll.useQuery()

    return (
        <Layout>
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
