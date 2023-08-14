export type NavMenuItem = {
    label: string
    icon: string
    href: string
}

export const navMenu = [
    {
        label: "Journals",
        icon: "",
        href: "/journals",
    },
    {
        label: "Statistics",
        icon: "",
        href: "/journals",
    },
    {
        label: "Settings",
        icon: "",
        href: "/journals",
    },
] satisfies NavMenuItem[]
