// PaymentForm.tsx
"use client"
import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components"
import { CheckoutFormValues } from "../index"
import { loadStripe } from "@stripe/stripe-js"
import { ICoupon, UserCart } from "@/types"
import { API } from "@/constant"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface IPayment {
	userCart: UserCart[]
	coupon: {
		message: string
		data: ICoupon
		success: boolean
	}
}

const PaymentForm = ({ userCart, coupon }: IPayment) => {
	const { handleSubmit } = useFormContext<CheckoutFormValues>()
	const stripe = useStripe()
	const elements = useElements()
	const [isProcessing, setIsProcessing] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	const searchParams = useSearchParams()
	const pathname = usePathname()
	const backUrl = `${pathname}?${searchParams.toString()}`
	const makePayment = async () => {
		const stripe = await loadStripe(
			process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
		)
		const body = {
			products: userCart,
			couponCode: coupon ? coupon.data.code : "",
			backUrl,
		}
		const headers = {
			"Content-Type": "application/json",
		}

		console.log(body)

		const response = await fetch(API + "/order/create-checkout-session", {
			method: "POST",
			headers,
			body: JSON.stringify(body),
			credentials: "include",
		})

		const session = await response.json()
		const result = stripe?.redirectToCheckout({
			sessionId: session.id,
		})

		console.log(result)
	}

	return (
		<div>
			<Button
				className="p-2 px-6 rounded-md hover-effect border-2 border-red-500 hover:bg-red-500 hover:text-white inline-block"
				type="submit"
				disabled={isProcessing || !stripe || !elements}
				loading={isProcessing}
				onClick={handleSubmit(makePayment)}
			>
				Submit
			</Button>
			{message && <div>{message}</div>}
		</div>
	)
}

export default PaymentForm
