import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import type { CollectionSlug } from "payload";

export const productsRouter = createTRPCRouter({
    getMany: baseProcedure.query(async ({ ctx }) => {
        const data = await ctx.db.find({
            collection: "products" as CollectionSlug,
            depth: 1,
        });

        return data;
    }),
});