import z from "zod";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { Media, Tenant } from "@/payload-types";
import { TRPCError } from "@trpc/server";
import Stripe from "stripe";
import { CheckoutMetadata, ProductMetadata } from "../types";
import { stripe } from "@/lib/stripe";
import { PLATFORM_FEE_PERCENTAGE } from "@/constants";


export const checkoutRouter = createTRPCRouter({
    verify: protectedProcedure
        .mutation(async ({ ctx }) => {
            const user = await ctx.db.findByID({
                collection: "users",
                id: ctx.session.user.id,
                depth: 0, // Prevent population of tenant field
            });

            if (!user) {
                throw new TRPCError({
                    message: "User not found",
                    code: "NOT_FOUND"
                });
            }

            // Get the tenantID - now it should be just the ID string
            const tenantId = user.tenants?.[0]?.tenant as string;
            
            console.log("User tenants array:", user.tenants);
            console.log("Extracted tenant ID:", tenantId);
            
            if (!tenantId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "User is not associated with any tenant",
                });
            }
            
            const tenant = await ctx.db.findByID({
                collection: "tenants",
                id: tenantId,
            })

            if (!tenant){
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Tenant not found",
                });
            }

            // Check if tenant has a Stripe account ID
            if (!tenant.stripeAccountId) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Tenant does not have a Stripe account",
                });
            }

            // Check if NEXT_PUBLIC_APP_URL is set
            if (!process.env.NEXT_PUBLIC_APP_URL) {
                throw new TRPCError({
                    code: "INTERNAL_SERVER_ERROR",
                    message: "NEXT_PUBLIC_APP_URL environment variable is not set",
                });
            }

            console.log("Creating Stripe account link for tenant:", tenant.id);
            console.log("Stripe account ID:", tenant.stripeAccountId);
            console.log("App URL:", process.env.NEXT_PUBLIC_APP_URL);

            const accountLink = await stripe.accountLinks.create({
                account: tenant.stripeAccountId,
                refresh_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
                return_url: `${process.env.NEXT_PUBLIC_APP_URL}/admin`,
                type: "account_onboarding",
            });

            if (!accountLink.url){
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Failed to create verification request",
                });
            }

            console.log("Stripe account link created:", accountLink.url);
            return { url: accountLink.url };
        }),
    purchase: protectedProcedure
        .input(
            z.object({
                productIds: z.array(z.string()).min(1),
                tenantSlug: z.string().min(1),
            })
        )
        .mutation(async ({ ctx, input }) => {
            const products = await ctx.db.find({
                collection: "products",
                depth: 2,
                where: {
                    and: [
                        {
                            id: {
                                in: input.productIds,
                            }
                        },
                        {
                            "tenant.slug": {
                                equals: input.tenantSlug
                            }
                        },
                        {
                            isArchived: {
                                not_equals: true,
                            },
                        }
                    ]
                }
            })

            if (products.totalDocs !== input.productIds.length) {
                throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
            }

            const tenantsData = await ctx.db.find({
                collection: "tenants",
                limit: 1,
                pagination: false,
                where: {
                    slug: {
                        equals: input.tenantSlug,
                    },
                },
            });

            const tenant = tenantsData.docs[0];

            if (!tenant) {
                throw new TRPCError({
                    code: "NOT_FOUND",
                    message: "Tenant not found",
                })
            }

            if(!tenant.stripeDetailsSubmitted) {
                throw new TRPCError({
                    code: "BAD_REQUEST",
                    message: "Tenant not allowed to sell products",
                })
            }

            const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
                products.docs.map((product) => ({
                    quantity: 1,
                    price_data: {
                        unit_amount: product.price * 100, // Stripe handles prices in cents
                        currency: "usd",
                        product_data: {
                            name: product.name,
                            metadata: {
                                stripeAccountId: tenant.stripeAccountId,
                                id: product.id,
                                name: product.name,
                                price: product.price
                            } as ProductMetadata
                        }
                    }
                }));
            
            const totalAmount = products.docs.reduce(
                (acc, item) => acc + item.price * 100,
                0
            );

            const platformFeeAmount = Math.round(
                totalAmount * (PLATFORM_FEE_PERCENTAGE / 100)
            );

            const checkout = await stripe.checkout.sessions.create({
                customer_email: ctx.session.user.email,
                success_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
                cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/tenants/${input.tenantSlug}/checkout?success=true`,
                mode: "payment",
                line_items: lineItems,
                invoice_creation: {
                    enabled: true,
                },

                metadata: {
                    userId: ctx.session.user.id
                } as CheckoutMetadata,

                payment_intent_data: {
                    application_fee_amount: platformFeeAmount,
                }
            }, {
                stripeAccount: tenant.stripeAccountId,
            });

            if (!checkout.url) {
                throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message:"Failed to create checkout session" });
            }

            return { url: checkout.url };
        })
    ,
    getProducts: baseProcedure
        .input(
            z.object({
                ids: z.array(z.string()),
            }),
        )
        .query(async ({ ctx,input }) => {
            const data = await ctx.db.find({
                collection: "products",
                depth: 2,   //Populate "category", "image", "tenant"
                where: {
                    and: [
                        {
                            id: {
                                in: input.ids,
                            },
                        },
                        {
                            isArchived: {
                                not_equals: true,
                            },
                        },
                    ],
                },
            });

            if (data.totalDocs !== input.ids.length){
                throw new TRPCError({ code: "NOT_FOUND", message: "Products not found" });
            }

            return {
                ...data,
                docs: data.docs.map((doc) => ({
                    ...doc,
                    image: doc.image as Media | null,
                    tenant: doc.tenant as Tenant & { image: Media | null },
                }))
            }
        })
});