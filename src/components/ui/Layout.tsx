import DesktopNav from "./DesktopNav"
import MobileNav from "./MobileNav"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative flex lg:flex-row flex-col w-full h-screen">
            <MobileNav />
            <DesktopNav />
            <main className="h-screen overflow-y-scroll py-24  mx-auto w-full flex flex-col items-center justify-center">
                {children}
            </main>
        </div>
    )
}

export default Layout
