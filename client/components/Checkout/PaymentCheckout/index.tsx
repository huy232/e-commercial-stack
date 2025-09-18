"use client"
import React, { useState } from "react"
import { useFormContext } from "react-hook-form"
import { useStripe, useElements } from "@stripe/react-stripe-js"
import { Button } from "@/components"
import { CheckoutFormValues } from "../index"
import { loadStripe } from "@stripe/stripe-js"
import { Cart, ICoupon } from "@/types"
import { usePathname, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useSelector } from "react-redux"
import { selectAuthUser } from "@/store/slices/authSlice"

interface IPayment {
	userCart: Cart[] | null
	coupon: {
		message: string
		data: ICoupon
		success: boolean
	}
}

const PaymentForm = ({ userCart, coupon }: IPayment) => {
	const { handleSubmit, watch, register } = useFormContext<CheckoutFormValues>()
	const stripe = useStripe()
	const elements = useElements()
	const [isProcessing, setIsProcessing] = useState(false)
	const [message, setMessage] = useState<string | null>(null)

	const searchParams = useSearchParams()
	const pathname = usePathname()
	const backUrl = `${pathname}?${searchParams.toString()}`
	const user = useSelector(selectAuthUser)

	const useExisting = watch("useExistingAddress")
	const notes = watch("notes")

	const makePayment = async () => {
		if (useExisting && !user?.address) {
			setMessage(
				"⚠️ You must first add a saved address in your Profile Information before using this option."
			)
			return
		}

		try {
			setIsProcessing(true)
			const stripeClient = await loadStripe(
				process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
			)
			const body = {
				products: userCart,
				couponCode: coupon ? coupon.data.code : "",
				notes,
				useExistingAddress: useExisting,
				backUrl,
			}

			const response = await fetch("/api/order/create-checkout-session", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(body),
				credentials: "include",
			})

			const session = await response.json()
			await stripeClient?.redirectToCheckout({ sessionId: session.id })
		} catch (error) {
			setMessage("⚠️ Something went wrong while processing your checkout.")
			console.error(error)
		} finally {
			setIsProcessing(false)
		}
	}

	return (
		<div className="text-center space-y-4">
			<div className="mx-4">
				<label
					htmlFor="notes"
					className="block text-sm font-medium text-gray-700 mb-1"
				>
					Order Notes
				</label>
				<textarea
					id="notes"
					{...register("notes")}
					placeholder="Write any special requests or delivery notes..."
					className="w-full border rounded-lg p-2 text-sm focus:ring-rose-400 focus:border-rose-400"
					rows={3}
				/>
			</div>

			<Button
				className="py-3 px-8 rounded-full font-semibold bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md hover:from-rose-600 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
				type="submit"
				disabled={isProcessing || !stripe || !elements}
				loading={isProcessing}
				onClick={handleSubmit(makePayment)}
				aria-label="Submit Payment"
				role="button"
				id="submit-payment-button"
			>
				{isProcessing ? "Processing..." : "Submit Payment"}
			</Button>

			{message && (
				<motion.div
					initial={{ opacity: 0, y: -10 }}
					animate={{ opacity: 1, y: 0 }}
					className="p-3 rounded-md bg-red-100 text-red-700 text-sm font-medium shadow-sm"
				>
					{message}
				</motion.div>
			)}

			{!isProcessing && (
				<p className="text-xs text-gray-500 italic">
					You’ll be securely redirected to Stripe to complete your payment.
				</p>
			)}
		</div>
	)
}

export default PaymentForm
