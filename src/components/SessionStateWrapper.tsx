import { signIn, signOut, useSession } from "next-auth/react"

export type SessionStateWrapperProps = {
    User: (
        session: ReturnType<typeof useSession>,
        logout: () => void
    ) => JSX.Element
    Guest: (login: () => void) => JSX.Element
}

const SessionStateWrapper: React.FC<SessionStateWrapperProps> = ({
    Guest,
    User,
}) => {
    const session = useSession()

    function handleLogout() {
        void signOut()
    }

    function handleLogin() {
        void signIn("discord")
    }

    if (session.data?.user.id) return User(session, handleLogout)
    return Guest(handleLogin)
}

export default SessionStateWrapper
