import SessionStateWrapper from "../SessionStateWrapper"

const Header = () => {
    return (
        <header className="sticky top-0 px-4 py-2 bg-zinc-900">
            <SessionStateWrapper
                Guest={(login) => (
                    <div>
                        <button onClick={login}>login</button>
                    </div>
                )}
                User={(session, logout) => (
                    <div>
                        <div>{session.data?.user.name}</div>
                        <button onClick={logout}>Logout</button>
                    </div>
                )}
            />
        </header>
    )
}

export default Header
