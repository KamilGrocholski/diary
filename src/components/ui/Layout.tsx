import Footer from "./Footer"
import Header from "./Header"

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <div className="flex flex-col">
            <Header />
            <main className="min-h-screen py-24 container mx-auto flex flex-col items-center justify-center">
                {children}
            </main>
            <Footer />
        </div>
    )
}

export default Layout
