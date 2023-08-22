import {
    type NextPage,
    type GetServerSidePropsContext,
    type InferGetServerSidePropsType,
} from "next"
import { signIn } from "next-auth/react"
import Head from "next/head"
import "react-calendar/dist/Calendar.css"
import { BsDiscord, BsGithub, BsGoogle } from "react-icons/bs"
import { getServerAuthSession } from "~/server/auth"

const LandingPage: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = (_props) => {
    return (
        <>
            <Head>
                <title>Diary app</title>
                <meta name="description" content="Diary app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main>
                <section className="absolute w-full h-full">
                    <div className="container mx-auto px-4 h-full">
                        <div className="flex content-center items-center justify-center h-full">
                            <div className="md:w-fit min-w-[300px] px-4">
                                <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-rosePineDawn-text border-0 shadow-rosePine-highlightLow">
                                    <div className="rounded-t mb-0 px-6 py-6">
                                        <div className="text-center mb-3">
                                            <h6 className="text-rosePine-base text-md font-bold">
                                                Sign in with
                                            </h6>
                                        </div>
                                        <div className="w-full flex md:flex-row gap-2 flex-col md:justify-between">
                                            <LoginBtn
                                                icon={<BsGithub />}
                                                name="Github"
                                                action={() =>
                                                    void signIn("github")
                                                }
                                            />
                                            <LoginBtn
                                                icon={<BsDiscord />}
                                                name="Discord"
                                                action={() =>
                                                    void signIn("discord")
                                                }
                                            />
                                            <LoginBtn
                                                icon={<BsGoogle />}
                                                name="Google"
                                                action={() =>
                                                    void signIn("google")
                                                }
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    )
}

const LoginBtn: React.FC<{
    name: string
    icon: React.ReactElement
    action: () => void
}> = ({ icon, action, name }) => {
    return (
        <button
            className="transition-all duration-200 ease-in-out bg-rosePine-base active:bg-gray-100 md:px-4 px-6 md:py-2 py-4 rounded outline-none focus:outline-none mr-1 mb-1 uppercase flex flex-row justify-center shadow hover:shadow-md  items-center font-bold text-xs gap-2 hover:bg-rosePine-iris hover:text-rosePine-base"
            type="button"
            onClick={action}
        >
            <span className="text-lg">{icon}</span>
            <span className="text-md">{name}</span>
        </button>
    )
}

export default LandingPage

export async function getServerSideProps({
    req,
    res,
}: GetServerSidePropsContext) {
    const session = await getServerAuthSession({ req, res })

    if (session?.user) {
        return {
            redirect: {
                destination: "/home",
            },
        }
    }

    return {
        props: {},
    }
}
