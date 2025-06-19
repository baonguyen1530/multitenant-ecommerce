import type { Stripe } from "stripe";
import { getPayload } from "payload";
import config from "@payload-config";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            await (await req.blob()).text(),
            req.headers.get("stripe-signature") as string,
            process.env.STRIPE_WEBHOOK_SECRET as string,
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Unknown error";

        if (error! instanceof Error) {
            console.log(error);
        }
        
        console.log(`❌Error message: ${errorMessage}`);

        return NextResponse.json(
            { message: `Webhook Error: ${errorMessage}` },
            { status: 400 }
        )
    }

    console.log("✅Success: ", event.id);

    const permittedEvents: string[] = [
        "checkout.session.completed",
    ];

    const payload = await getPayload({ config });

    if (permittedEvents.includes(event.type)) {
        let data;

        try {
            switch (event.type) {
                case "checkout.session.completed":
                    data = event.data.object as Stripe.Checkout.Session;

                    if (!data.metadata?.userId) {
                        throw new Error("User ID is required");
                    }
            }
        } catch {
            
        }
    }
};