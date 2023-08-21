export const diaryDateFormatter = Intl.DateTimeFormat("en-En", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
})

export const diaryEntryDateFormatter = new Intl.DateTimeFormat("en-En", {
    day: "2-digit",
    weekday: "short",
    month: "short",
})
