export type NavMenuItem = {
    label: string
    icon: string
    href: string
}

export const navMenu = [
    {
        label: "Diaries",
        icon: "",
        href: "/diaries",
    },
    {
        label: "Statistics",
        icon: "",
        href: "/statistics",
    },
    {
        label: "Settings",
        icon: "",
        href: "/settings",
    },
] satisfies NavMenuItem[]

export const createEntryContentPlaceholder = "Today I did..."
