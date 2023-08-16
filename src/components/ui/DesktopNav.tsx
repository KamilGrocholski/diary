import { navMenu } from "~/const/config"

const DesktopNav = () => {
    return (
        <nav className="sticky bottom-0 lg:flex hidden w-48 bg-zinc-500 h-screen">
            <ul className="flex flex-col gap-3">
                {navMenu.map((item) => (
                    <li key={item.label}>{item.label}</li>
                ))}
            </ul>
        </nav>
    )
}

export default DesktopNav
