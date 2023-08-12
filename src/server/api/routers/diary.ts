import { TRPCError } from "@trpc/server"
import {
    createTRPCRouter,
    diaryOwnerProcedure,
    protectedProcedure,
} from "~/server/api/trpc"
import { type RouterInputs, type RouterOutputs } from "~/utils/api"
import { diarySchemes } from "~/utils/schemes/diary"

export type DiaryRouterOutputs = RouterOutputs["diary"]
export type DiaryRouterInputs = RouterInputs["diary"]

export const diaryRouter = createTRPCRouter({
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
    remove: diaryOwnerProcedure
        .input(diarySchemes.remove)
        .mutation(({ ctx, input }) => {
            return ctx.prisma.diary.delete({
                where: {
                    id: input.id,
                },
            })
        }),
    addEntry: diaryOwnerProcedure
        .input(diarySchemes.addEntry)
        .mutation(async ({ ctx, input }) => {
            const { title, content } = input

            const todayStart = new Date(new Date().setHours(0, 0, 0, 0))
            const todayEnd = new Date(new Date().setHours(23, 59, 59, 999))

            const diaryEntry = await ctx.prisma.diaryEntry.findUnique({
                where: {
                    diaryId: ctx.input.diaryId,
                    createdAt: {
                        lte: todayEnd,
                        gte: todayStart,
                    },
                },
            })

            if (diaryEntry) {
                throw new TRPCError({
                    code: "FORBIDDEN",
                    message: "A diary entry has already been created today.",
                })
            }

            return ctx.prisma.diaryEntry.create({
                data: {
                    diaryId: ctx.input.diaryId,
                    title,
                    content,
                },
            })
        }),
    removeEntry: diaryOwnerProcedure
        .input(diarySchemes.removeEntry)
        .mutation(({ ctx, input }) => {
            return ctx.prisma.diaryEntry.delete({
                where: {
                    id: input.id,
                },
            })
        }),
    editEntry: diaryOwnerProcedure
        .input(diarySchemes.editEntry)
        .mutation(({ ctx, input }) => {
            return ctx.prisma.diaryEntry.update({
                where: { id: input.id },
                data: {
                    content: input.content,
                    title: input.title,
                },
            })
        }),
    getEntryById: diaryOwnerProcedure
        .input(diarySchemes.getById)
        .query(({ ctx, input }) => {
            return ctx.prisma.diaryEntry.findUnique({
                where: {
                    id: input.id,
                },
            })
        }),
})
