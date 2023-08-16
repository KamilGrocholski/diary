import SessionStateWrapper from "../SessionStateWrapper"
import Link from "next/link"
import { navMenu } from "~/const/config"

const MobileNav = () => {
    return (
        <nav className="fixed bottom-0 lg:hidden flex left-0 right-0 h-14 px-4 py-2 bg-zinc-700 w-full z-50">
            <SessionStateWrapper
                Guest={(login) => (
                    <div>
                        <button onClick={login}>login</button>
                    </div>
                )}
                User={(session, logout) => (
                    <ul className="flex flex-row justify-between w-full h-full">
                        {navMenu.map((item) => (
                            <NavButton key={item.label} {...item} />
                        ))}
                    </ul>
                )}
            />
        </nav>
    )
}

export default MobileNav

type NavButtonProps = {
    icon: string
    label: string
    href: string
}

const NavButton: React.FC<NavButtonProps> = (props) => {
    return (
        <Link className="hover:bg-zinc-200  py-2 rounded-md" href={props.href}>
            <li>{props.label}</li>
        </Link>
    )
}
