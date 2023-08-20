import { appRouter } from "../root"
import { createTRPCContext } from "../trpc"
import { createServerSideHelpers } from "@trpc/react-query/server"
import { IncomingMessage, ServerResponse } from "http"
import { type NextApiRequest, type NextApiResponse } from "next"
import SuperJSON from "superjson"

type RequestType = IncomingMessage & {
    cookies: Partial<{
        [key: string]: string
    }>
}

type ResponseType = ServerResponse

type Args = {
    req: RequestType
    res: ResponseType
    /** If true, will skip getting the server-side session. */
    skipSession?: boolean
}

export const createSSGHelper = async ({
    req,
    res,
    skipSession = false,
}: Args) =>
    createServerSideHelpers({
        router: appRouter,
        ctx: await createTRPCContext(
            {
                req: req as NextApiRequest,
                res: res as NextApiResponse,
            },
            skipSession
        ),
        transformer: SuperJSON,
    })
