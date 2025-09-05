// PaymentForm.tsx
"use client"
import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js"
import { Button } from "@/components"
import { CheckoutFormValues } from "../index"
import { loadStripe } from "@stripe/stripe-js"
import { Cart, ICoupon } from "@/types"
import { API } from "@/constant"
import { usePathname, useRouter, useSearchParams } from "next/navigation"

interface IPayment {
	userCart: Cart[] | null
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
		try {
			setIsProcessing(true)
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

			const response = await fetch("/api/order/create-checkout-session", {
				method: "POST",
				headers,
				body: JSON.stringify(body),
				credentials: "include",
			})

			const session = await response.json()
			const result = stripe?.redirectToCheckout({
				sessionId: session.id,
			})
		} catch (error) {
			setMessage("Something went wrong while doing checkout process.")
			console.log(error)
		} finally {
			setIsProcessing(false)
		}
	}

	return (
		<div className="text-center">
			<Button
				className="py-2 px-6 rounded-md hover-effect border-2 bg-rose-500 hover:text-white inline-block"
				type="submit"
				disabled={isProcessing || !stripe || !elements}
				loading={isProcessing}
				onClick={handleSubmit(makePayment)}
			>
				Submit
			</Button>
			{message && <div className="text-red-500 italic">{message}</div>}
		</div>
	)
}

export default PaymentForm
