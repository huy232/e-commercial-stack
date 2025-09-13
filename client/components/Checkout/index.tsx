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
import PaymentForm from "./PaymentCheckout"
import {
	formatDiscount,
	formatDiscountDisplay,
	formatPrice,
	handleCalculatePrice,
} from "@/utils"
import { selectCart } from "@/store/slices/cartSlice"
import PaymentSkeleton from "./PaymentSkeleton"
import { motion } from "framer-motion"
import Link from "next/link"
import { selectAuthUser } from "@/store/slices/authSlice"

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
	const user = useSelector(selectAuthUser)
	const cart = useSelector<RootState, Cart[] | null>(selectCart)
	const [clientSecret, setClientSecret] = useState("")
	const mounted = useMounted()

	const totalPrice = useMemo(() => {
		if (!cart) {
			return 0
		}

		return cart.reduce((acc: number, item) => {
			return acc + handleCalculatePrice(item)
		}, 0)
	}, [cart])

	useEffect(() => {
		if (!user) return
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
	}, [user])

	if (!mounted) {
		return (
			<div className="flex items-center justify-center">
				<div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-red-500"></div>
			</div>
		)
	}

	if (mounted && !user) {
		// UI for users not logged in
		return (
			<div className="flex flex-col items-center justify-center gap-4 h-[60vh]">
				<motion.div
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
					className="text-center"
				>
					<h2 className="text-2xl font-bold mb-2">You need to log in first</h2>
					<p className="text-gray-600 mb-4">
						Please login to complete your checkout and proceed with payment.
					</p>
					<div className="flex gap-4 justify-center flex-wrap">
						<Link
							href="/login"
							className="px-6 py-2 bg-teal-500 text-white rounded-lg font-medium hover:bg-teal-600 transition"
						>
							Login
						</Link>
						<Link
							href="/register"
							className="px-6 py-2 border-2 border-teal-500 text-teal-500 rounded-lg font-medium hover:bg-teal-500 hover:text-white transition"
						>
							Register
						</Link>
						<Link
							href="/cart"
							className="px-6 py-2 border-2 border-gray-400 text-gray-600 rounded-lg font-medium hover:bg-gray-200 transition"
						>
							Continue as guest
						</Link>
					</div>
				</motion.div>
			</div>
		)
	}

	return (
		<FormProvider {...methods}>
			<motion.div
				initial={{ x: -50, opacity: 0 }}
				animate={{ x: 0, opacity: 1 }}
				transition={{ duration: 0.6, ease: "easeOut" }}
				className="text-center sm:text-left mx-2"
			>
				<Link
					href="/cart"
					className="inline-flex items-center gap-2 py-2 px-4 bg-rose-500 text-white rounded-lg relative overflow-hidden group font-medium transition-all duration-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500"
				>
					<span className="absolute left-2 opacity-0 -translate-x-5 transition-all duration-500 group-hover:-translate-x-1 group-hover:opacity-100">
						←
					</span>
					<span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
						Back to cart
					</span>
				</Link>
			</motion.div>
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
