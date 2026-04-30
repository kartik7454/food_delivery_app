import { NextRequest } from "next/server";
import { Order } from "../../../lib/orders";
import { authOptions } from "@/utils/authoptions";
import { getServerSession } from "next-auth";
import { connectToDB } from "@/lib/connectDb";

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export async function POST(request: NextRequest) {
  try {
    // ✅ 1. CONNECT DB FIRST (CRITICAL FIX)
    await connectToDB();

    // ✅ 2. Parse request
    const { cartitem, address } = await request.json();

    // ✅ 3. Get user session
    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401 }
      );
    }

    const postalcode = Number(session?.user?.postalcode);
    const email = session?.user?.email;
    const phonenumber = Number(session?.user?.phonenumber);
    const name = session?.user?.name;

    // ✅ 4. Create order
    const orderDoc = await Order.create({
      email,
      name,
      postalcode,
      address,
      phonenumber,
      cartitem,
      stripeid: "",
    });

    // ✅ 5. Prepare Stripe items
    const stripeLineItems = cartitem.map((item: any) => {
      const price = Number(item.total);
    
      // 🚨 HARD VALIDATION (this is what you're missing)
      if (!price || isNaN(price)) {
        throw new Error(`Invalid price for item: ${JSON.stringify(item)}`);
      }
    
      return {
        quantity: 1,
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name || "Product",
          },
          unit_amount: Math.round(price * 100), // ✅ always integer
        },
      };
    });

    // ✅ 6. Create Stripe session
    const stripeSession = await stripe.checkout.sessions.create({
      line_items: stripeLineItems,
      mode: "payment",
      customer_email: email,
      success_url:
        process.env.NEXTAUTH_URL +
        "/dashboard/orders/" +
        orderDoc._id.toString() +
        "?clear-cart=1",
      cancel_url:
        process.env.NEXTAUTH_URL +
        "/dashboard/orders/" +
        orderDoc._id.toString(),
      metadata: {
        orderId: orderDoc._id.toString(),
      },
      payment_intent_data: {
        metadata: {
          orderId: orderDoc._id.toString(),
        },
      },
    });

    // ✅ 7. Update order with Stripe ID (FIXED ObjectId misuse)
    await Order.findByIdAndUpdate(orderDoc._id, {
      stripeid: stripeSession.id,
    });

    // ✅ 8. Return response
    return Response.json({
      url: stripeSession.url,
      orderId: orderDoc._id,
    });
  } catch (error: any) {
    console.error("❌ ERROR:", error);

    return new Response(
      JSON.stringify({
        error: error?.message || "Something went wrong",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}