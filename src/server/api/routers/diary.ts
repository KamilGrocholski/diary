import { TRPCError } from "@trpc/server"
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc"
import { type RouterInputs, type RouterOutputs } from "~/utils/api"
import { diarySchemes } from "~/utils/schemes/diary"

export type DiaryRouterOutputs = RouterOutputs["diary"]
export type DiaryRouterInputs = RouterInputs["diary"]

const config = {
    charsFromContentInPreview: 503,
} as const

function assureIsDiaryOwner(userId: string, diaryOwnerId?: string) {
    if (!diaryOwnerId) return
    if (userId !== diaryOwnerId) {
        throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "You are not the owner of the diary!",
        })
    }
}

export const diaryRouter = createTRPCRouter({
    diaryActivityById: protectedProcedure
        .input(diarySchemes.getById)
        .query(async ({ ctx, input }) => {
            const diary = await ctx.prisma.diary.findUnique({
                where: { id: input.id },
                select: { userId: true },
            })

            assureIsDiaryOwner(ctx.session.user.id, diary?.userId)

            return ctx.prisma.diaryEntry.findMany({
                where: { diaryId: input.id },
                include: {
                    diary: true,
                },
            })
        }),
    getById: protectedProcedure
        .input(diarySchemes.getById)
        .query(async ({ ctx, input }) => {
            const { id } = input

            const diary = await ctx.prisma.diary.findUnique({
                where: {
                    id,
                },
                include: {
                    entries: {
                        select: {
                            createdAt: true,
                            updatedAt: true,
                            diaryId: true,
                            id: true,
                            diary: {
                                select: {
                                    userId: true,
                                    id: true,
                                },
                            },
                            title: true,
                            content: true,
                        },
                        orderBy: {
                            createdAt: "desc",
                        },
                    },
                    _count: true,
                    user: {
                        select: { id: true },
                    },
                },
            })

            assureIsDiaryOwner(ctx.session.user.id, diary?.userId)

            if (diary?.entries) {
                for (const entry of diary.entries) {
                    let slicedContent = entry.content.slice(
                        0,
                        config.charsFromContentInPreview
                    )
                    if (
                        entry.content.length > config.charsFromContentInPreview
                    ) {
                        slicedContent += "..."
                    }

                    entry.content = slicedContent
                }
            }

            return diary
        }),
    getAll: protectedProcedure.query(({ ctx }) => {
        return ctx.prisma.diary.findMany({
            where: {
                userId: ctx.session.user.id,
            },
            select: {
                title: true,
                id: true,
                _count: {
                    select: {
                        entries: true,
                    },
                },
                entries: {
                    take: 1,
                    orderBy: {
                        createdAt: "desc",
                    },
                },
            },
        })
    }),
    create: protectedProcedure
        .input(diarySchemes.create)
        .mutation(({ ctx, input }) => {
            return ctx.prisma.diary.create({
                data: {
                    userId: ctx.session.user.id,
                    title: input.title,
                },
            })
        }),
    remove: protectedProcedure
        .input(diarySchemes.remove)
        .mutation(({ ctx, input }) => {
            return ctx.prisma.diary.delete({
                where: {
                    id: input.id,
                },
            })
        }),
    addEntry: protectedProcedure
        .input(diarySchemes.addEntry)
        .mutation(async ({ ctx, input }) => {
            const { title, content, id } = input

            const diary = await ctx.prisma.diary.findUnique({
                where: { id },
                select: { userId: true },
            })

            assureIsDiaryOwner(ctx.session.user.id, diary?.userId)

            return ctx.prisma.diaryEntry.create({
                data: {
                    diaryId: id,
                    title,
                    content,
                },
            })
        }),
    removeEntry: protectedProcedure
        .input(diarySchemes.removeEntry)
        .mutation(async ({ ctx, input }) => {
            const entry = await ctx.prisma.diaryEntry.findUnique({
                where: { id: input.id },
                select: { diary: { select: { userId: true } } },
            })

            assureIsDiaryOwner(ctx.session.user.id, entry?.diary?.userId)

            return ctx.prisma.diaryEntry.delete({
                where: {
                    id: input.id,
                },
            })
        }),
    editEntry: protectedProcedure
        .input(diarySchemes.editEntry)
        .mutation(async ({ ctx, input }) => {
            const entry = await ctx.prisma.diaryEntry.findUnique({
                where: { id: input.id },
                select: { diary: { select: { userId: true } } },
            })

            assureIsDiaryOwner(ctx.session.user.id, entry?.diary?.userId)

            return ctx.prisma.diaryEntry.update({
                where: { id: input.id },
                data: {
                    content: input.content,
                    title: input.title,
                },
            })
        }),
    getEntryById: protectedProcedure
        .input(diarySchemes.getById)
        .query(async ({ ctx, input }) => {
            const entry = await ctx.prisma.diaryEntry.findUnique({
                where: { id: input.id },
                include: {
                    diary: {
                        select: {
                            userId: true,
                        },
                    },
                },
            })

            assureIsDiaryOwner(ctx.session.user.id, entry?.diary.userId)

            return entry
        }),
})
