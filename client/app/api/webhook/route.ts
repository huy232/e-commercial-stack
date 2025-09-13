import Stripe from "stripe"
import { NextRequest, NextResponse } from "next/server"

export const config = {
	api: {
		bodyParser: false,
	},
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
})

export async function POST(req: NextRequest) {
	const buf = await req.arrayBuffer()
	const rawBody = Buffer.from(buf)

	const sig = req.headers.get("stripe-signature")!
	let event: Stripe.Event

	try {
		event = stripe.webhooks.constructEvent(
			rawBody,
			sig,
			process.env.STRIPE_WEBHOOK_SECRET!
		)
	} catch (err) {
		console.error("Webhook signature verification failed.", err)
		return NextResponse.json(
			{ error: "Webhook signature verification failed" },
			{ status: 400 }
		)
	}

	// handle event
	switch (event.type) {
		case "checkout.session.completed":
			console.log("Payment succeeded!")
			break
		default:
			console.log(`Unhandled event type ${event.type}`)
	}

	return NextResponse.json({ received: true })
}
