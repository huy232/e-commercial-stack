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
			const response = await fetch(API + "/order/create-payment-intent", {
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
				<div className="mx-4 col-span-1 max-h-[260px] overflow-y-auto">
					<CartCheckout mounted={mounted} cart={cart} />
				</div>
				<div className="mx-4 col-span-1">
					<CouponCheckout
						mounted={mounted}
						coupon={coupon}
						discount={discount}
						readOnly
					/>
				</div>
				{clientSecret && (
					<Elements stripe={stripePromise} options={{ clientSecret }}>
						<div className="flex flex-col col-span-1 lg:col-start-2 lg:col-end-2">
							<div className="mx-4 border-rose-500 border-2 rounded p-2 mb-4">
								<div className="flex justify-between items-center py-4">
									<span className="font-medium">Orignal price</span>
									<span className="text-xs text-gray-500">
										{formatPrice(totalPrice)}
									</span>
								</div>
								<div className="flex justify-between items-center py-4">
									<span className="font-medium">Discount</span>
									<span className="text-sm bg-yellow-500 rounded p-1 text-black">
										{coupon && coupon.data
											? formatDiscountDisplay(coupon.data)
											: "None"}
									</span>
								</div>
								<div className="flex justify-between items-center py-4">
									<span className="font-medium">Total price</span>
									<span className="text-sm text-teal-500">
										{coupon && coupon.data
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
						</div>
					</Elements>
				)}
			</form>
		</FormProvider>
	)
}

export default Checkout
