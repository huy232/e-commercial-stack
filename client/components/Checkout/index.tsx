// Checkout.tsx
"use client"
import { useEffect, useState } from "react"
import { CountryCode } from "libphonenumber-js"
import { useForm, FormProvider } from "react-hook-form"
import { useMounted } from "@/hooks"
import { ICoupon, UserCart } from "@/types"
import { useSelector } from "react-redux"
import { selectAuthUser } from "@/store/slices/authSlice"
import UserInformationCheckout from "./UserInformationCheckout"
import CartCheckout from "./CartCheckout"
import CouponCheckout from "./CouponCheckout"
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import PaymentForm from "./PaymentCheckout" // Import the PaymentForm component
import { API } from "@/constant"
import { formatDiscount, formatPrice } from "@/utils"

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
	const user = useSelector(selectAuthUser)
	const [clientSecret, setClientSecret] = useState("")

	const handleCalculatePrice = (item: UserCart) => {
		let total = 0
		if (item.variant) {
			total = (item.product.price + item.variant.price) * item.quantity
		} else {
			total = item.product.price * item.quantity
		}
		return total
	}

	const originalCartPrice = user
		? user.cart.reduce((acc: number, item: UserCart) => {
				return acc + handleCalculatePrice(item)
		  }, 0)
		: 0

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
			<form className="grid grid-cols-2 gap-4">
				<div className="col-span-1">
					<CartCheckout mounted={mounted} user={user} />
				</div>
				<div className="col-span-1">
					<CouponCheckout
						mounted={mounted}
						coupon={coupon}
						discount={discount}
						readOnly
					/>
				</div>
				{clientSecret && (
					<Elements stripe={stripePromise} options={{ clientSecret }}>
						<div className="flex flex-col">
							<div>
								<span className="font-semibold">Final</span>
								<span className="mx-1 text-sm text-green-500">
									{coupon && coupon.data
										? formatPrice(
												formatDiscount(
													coupon.data.discountType,
													coupon.data.discount,
													originalCartPrice
												)
										  )
										: formatPrice(originalCartPrice)}
								</span>
							</div>
							<PaymentForm userCart={user.cart} coupon={coupon} />
						</div>
					</Elements>
				)}
			</form>
		</FormProvider>
	)
}

export default Checkout
