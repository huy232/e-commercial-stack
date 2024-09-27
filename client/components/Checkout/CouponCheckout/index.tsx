"use client"

import { ICoupon } from "@/types"
import clsx from "clsx"
import { useFormContext } from "react-hook-form"
import PaymentCheckout from "../PaymentCheckout"

type CouponFormInputs = {
	couponCode: string
}

type UserCartProps = {
	discount?: string | string[]
	coupon: {
		message: string
		data: ICoupon
		success: boolean
	}
	mounted: boolean
	readOnly?: boolean
}

const CouponCheckout = ({
	mounted,
	coupon,
	discount,
	readOnly = false,
}: UserCartProps) => {
	const { register } = useFormContext()
	if (!mounted) {
		return null
	}
	return (
		<div>
			<div
				className={clsx(
					coupon && (coupon.success ? "text-teal-500" : "text-red-500"),
					"text-xs"
				)}
			>
				{coupon && coupon.message && <p>{coupon.message}</p>}
			</div>
			<input
				type="text"
				placeholder="Enter discount code here"
				className="w-full border rounded-md py-2 px-4"
				{...register("couponCode")}
				readOnly={readOnly}
			/>
		</div>
	)
}
export default CouponCheckout
