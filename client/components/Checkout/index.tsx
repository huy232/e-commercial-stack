// Checkout.tsx
"use client"
import { useEffect, useMemo, useState } from "react"
import { CountryCode } from "libphonenumber-js"
import { useForm, FormProvider } from "react-hook-form"
import { useMounted } from "@/hooks"
import { Cart, ICoupon, RootState } from "@/types"
import { useSelector } from "react-redux"
import CartCheckout from "./CartCheckout"
import CouponCheckout from "./CouponCheckout"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import PaymentForm from "./PaymentCheckout" // Import the PaymentForm component
import { API } from "@/constant"
import {
	formatDiscount,
	formatDiscountDisplay,
	formatPrice,
	handleCalculatePrice,
} from "@/utils"
import { selectCart } from "@/store/slices/cartSlice"
import PaymentSkeleton from "./PaymentSkeleton"
import { motion } from "framer-motion"

const stripePromise = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
)

export type UserCartProps = {
	discount?: string | string[]
	coupon: {
		message: string
		data: ICoupon
		success: boolean
	}
}

export interface CheckoutFormValues {
	phoneNumber: string
	country: CountryCode
	province: string
	district: string
	ward: string
	fullName: string
	address: string
	email: string
	notes?: string
	couponCode: string
}

const Checkout = ({ coupon, discount }: UserCartProps) => {
	const methods = useForm<CheckoutFormValues>({
		defaultValues: {
			notes: "",
			couponCode: discount ? (discount as string) : "",
		},
	})

	const mounted = useMounted()
	const cart = useSelector<RootState, Cart[] | null>(selectCart)
	const [clientSecret, setClientSecret] = useState("")

	const totalPrice = useMemo(() => {
		if (!cart) {
			return 0
		}

		return cart.reduce((acc: number, item) => {
			return acc + handleCalculatePrice(item)
		}, 0)
	}, [cart])

	useEffect(() => {
		const createPaymentIntent = async () => {
			const response = await fetch("/api/order/create-payment-intent", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include",
				body: JSON.stringify({ amount: 1000, currency: "usd" }),
			})
			const data = await response.json()
			setClientSecret(data.clientSecret)
		}
		createPaymentIntent()
	}, [])
	return (
		<FormProvider {...methods}>
			<form className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				<div className="mx-4 col-span-1 row-span-2 max-h-[500px] overflow-y-auto">
					<CartCheckout mounted={mounted} cart={cart} />
				</div>
				<div className="mx-4 col-span-1">
					<CouponCheckout
						mounted={mounted}
						coupon={coupon}
						discount={discount}
						readOnly={true}
					/>
				</div>
				{!clientSecret ? (
					<PaymentSkeleton />
				) : (
					<Elements stripe={stripePromise} options={{ clientSecret }}>
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.4 }}
							className="flex flex-col col-span-1 lg:col-start-2 lg:col-end-2 mb-4"
						>
							<div className="mx-4 border-rose-500 border-2 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition">
								<div className="flex justify-between items-center py-3">
									<span className="font-medium">Original price</span>
									<span className="text-xs text-gray-500">
										{formatPrice(totalPrice)}
									</span>
								</div>
								<div className="flex justify-between items-center py-3">
									<span className="font-medium">Discount</span>
									<span className="text-sm bg-yellow-400/90 rounded px-2 py-1 text-black font-semibold">
										{coupon?.data ? formatDiscountDisplay(coupon.data) : "None"}
									</span>
								</div>
								<div className="flex justify-between items-center py-3 border-t pt-3">
									<span className="font-medium">Total price</span>
									<span className="text-base text-teal-600 font-bold">
										{coupon?.data
											? formatPrice(
													formatDiscount(
														coupon.data.discountType,
														coupon.data.discount,
														totalPrice
													)
											  )
											: formatPrice(totalPrice)}
									</span>
								</div>
							</div>

							<PaymentForm userCart={cart} coupon={coupon} />
						</motion.div>
					</Elements>
				)}
			</form>
		</FormProvider>
	)
}

export default Checkout
