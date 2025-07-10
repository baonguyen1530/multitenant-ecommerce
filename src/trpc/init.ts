import { initTRPC, TRPCError } from '@trpc/server';
import { cache } from 'react';
import { getPayload } from 'payload';
import config from "@payload-config";
import superjson from "superjson";
import { headers as getHeaders } from "next/headers";

export const createTRPCContext = cache(async (): Promise<{ db: Awaited<ReturnType<typeof getPayload>> }> => {
  /**
   * @see: https://trpc.io/docs/server/context
   */
  const payload = await getPayload({ config });
  return { db: payload };
});
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<{ db: Awaited<ReturnType<typeof getPayload>> }>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure.use(async ({ next, ctx }) => {
  return next({ ctx });
});

export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const headers = await getHeaders();
  const session = await ctx.db.auth({ headers });

  if (!session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Not authenticated",
    });
  };

  return next({
    ctx: {
      ...ctx,
      session: {
        ...session,
        user: session.user,
      },
    },
  });
});