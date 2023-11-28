import { auth, currentUser } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prisma_db from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteUrl } from "@/lib/utils";

const settingUrl = absoluteUrl("/settings");

export async function GET() {
  try {
    const { userId } = auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const userSubscription = await prisma_db.userSubscription.findUnique({
      where: { userId }
    });

    if (userSubscription?.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: settingUrl
      });

      return new NextResponse(JSON.stringify({ url: stripeSession.url }));
    }

    const stripeSession = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      success_url: settingUrl,
      cancel_url: settingUrl,
      line_items: [
        {
          price_data: {
            currency: "USD",
            product_data: {
              name: "Genius Pro",
              description: "Unlimited AI Generations"
            },
            unit_amount: 2000,
            recurring: {
              interval: "month"
            }
          },
          quantity: 1
        }
      ],
      metadata: {
        userId,
      }
    });

    return new NextResponse(JSON.stringify({url: stripeSession.url}));

  } catch (error) {
    console.log("[STRIPE_ERROR]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}