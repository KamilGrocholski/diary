import Footer from "./Footer"
import MobileNav from "./MobileNav"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="relative flex flex-col">
            <MobileNav />
            <main className="min-h-screen py-24 px-3 container mx-auto flex flex-col items-center justify-center">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout
