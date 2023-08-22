import Button from "./Button"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/router"
import { BiLogOut } from "react-icons/bi"
import { navMenu } from "~/const/config"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter()

    return (
        <div className="min-h-screen flex w-full relative">
            <nav className="md:flex absolute h-fit md:h-full bottom-0 left-0 right-0 py-4 px-2 w-full md:w-56 flex-none bg-rosePine-surface border-r border-rosePine-highlightLow ">
                <div className="w-full text-center gap-24 flex flex-col">
                    <Link
                        href="/"
                        className="text-rosePine-iris text-2xl font-bold md:block hidden"
                    >
                        Diary
                    </Link>
                    <ul className="flex flex-row md:flex-col gap-5 w-full">
                        {navMenu.map((item) => (
                            <li key={item.label} className="flex w-full">
                                <Link
                                    href={item.href}
                                    className={`flex flex-col md:flex-row gap-1 items-center justify-center w-full md:p-2 p-1 rounded-md transition-all duration-100 ease-in-out hover:bg-rosePine-highlightMed ${
                                        router.pathname.includes(item.href) &&
                                        "bg-rosePine-highlightHigh"
                                    }`}
                                >
                                    <span>
                                        {item.icon({
                                            className: "text-2xl md:text-md",
                                        })}
                                    </span>
                                    <span>{item.label}</span>
                                </Link>
                            </li>
                        ))}
                        <li className="w-full flex">
                            <Button
                                variant="danger"
                                className="flex flex-col md:flex-row gap-1 items-center justify-center w-full md:p-2 p-1 rounded-md transition-all duration-100 ease-in-out hover:bg-rosePineDawn-love"
                                onClick={() => {
                                    void signOut({
                                        redirect: true,
                                        callbackUrl: "/",
                                    })
                                }}
                            >
                                <BiLogOut className="text-2xl md:text-md" />
                                <span>Logout</span>
                            </Button>
                        </li>
                    </ul>
                </div>
            </nav>
            <main className="py-12 flex flex-col min-w-0 overflow-auto items-center w-full h-screen">
                {children}
            </main>
        </div>
    )
}

export default Layout
