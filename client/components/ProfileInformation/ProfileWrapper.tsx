"use client"

import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { ProfileInformation } from "@/components"

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
)

export default function ProfileWrapper() {
	return (
		<Elements stripe={stripePromise}>
			<ProfileInformation />
		</Elements>
	)
}
