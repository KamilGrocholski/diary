import { z } from "zod"

export type BaseDiarySchema = z.infer<typeof baseDiarySchema>
export const baseDiarySchema = z.object({
    id: z.number().int(),
    title: z.string().min(1).max(55),
})

export type BaseDiaryEntrySchema = z.infer<typeof baseDiaryEntrySchema>
export const baseDiaryEntrySchema = z.object({
    id: z.number().int(),
    title: z.string().min(1).max(55),
    content: z.string().max(10000),
})

type _DiarySchemes = typeof diarySchemes
export type DiarySchemes = {
    [Key in keyof _DiarySchemes]: z.infer<_DiarySchemes[Key]>
}
export const diarySchemes = {
    create: baseDiarySchema.pick({ title: true }),
    getById: baseDiarySchema.pick({ id: true }),
    remove: baseDiarySchema.pick({ id: true }),
    addEntry: baseDiaryEntrySchema
        .pick({
            title: true,
            content: true,
        })
        .and(baseDiarySchema.pick({ id: true })),
    editEntry: baseDiaryEntrySchema.pick({
        id: true,
        title: true,
        content: true,
    }),
    removeEntry: baseDiaryEntrySchema.pick({
        id: true,
    }),
    getEntryById: baseDiaryEntrySchema.pick({
        id: true,
    }),
}
