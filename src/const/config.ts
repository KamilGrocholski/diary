import { type IconType } from "react-icons"
import { BiStats } from "react-icons/bi"
import { BsFillJournalBookmarkFill } from "react-icons/bs"
import { FiSettings } from "react-icons/fi"

export type NavMenuItem = {
    label: string
    icon: IconType
    href: string
}

export const navMenu = [
    {
        label: "Diaries",
        icon: BsFillJournalBookmarkFill,
        href: "/diaries",
    },
    {
        label: "Statistics",
        icon: BiStats,
        href: "/statistics",
    },
    {
        label: "Settings",
        icon: FiSettings,
        href: "/settings",
    },
] satisfies NavMenuItem[]

export const createEntryContentPlaceholder = "Today I did..."
