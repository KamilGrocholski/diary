import Button from "./Button"
import { signOut } from "next-auth/react"
import Link from "next/link"
import { navMenu } from "~/const/config"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="min-h-screen flex w-full">
            <nav className="py-4 px-2 w-56 flex-none bg-rosePine-surface border-r border-rosePine-highlightLow ">
                <div className="w-full text-center gap-24 flex flex-col">
                    <Link
                        href="/"
                        className="text-rosePine-iris text-2xl font-bold"
                    >
                        Diary
                    </Link>
                    <ul className="flex flex-col gap-5 w-full">
                        {navMenu.map((item) => (
                            <li key={item.label} className="w-full">
                                <Link
                                    href={item.href}
                                    className="w-full p-2 rounded-md transition-all duration-100 ease-in-out hover:bg-rosePine-highlightHigh"
                                >
                                    {item.label}
                                </Link>
                            </li>
                        ))}
                        <li className="w-full">
                            <Button
                                variant="danger"
                                onClick={() => {
                                    void signOut({
                                        redirect: true,
                                        callbackUrl: "/",
                                    })
                                }}
                            >
                                Logout
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
