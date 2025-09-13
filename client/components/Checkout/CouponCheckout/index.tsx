"use client"

import { ICoupon } from "@/types"
import clsx from "clsx"
import { motion } from "framer-motion"
import { useFormContext } from "react-hook-form"

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
		<div className="space-y-2">
			<motion.p
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				className={clsx(
					coupon && (coupon.success ? "text-teal-500" : "text-red-500"),
					"text-sm font-medium"
				)}
			>
				{coupon && coupon.message && <p>{coupon.message}</p>}
			</motion.p>
			<input
				type="text"
				placeholder="Coupon applied"
				className={clsx(
					"w-full border rounded-md py-2 px-4 transition focus:ring-2 focus:ring-rose-400",
					readOnly && "disabled:cursor-not-allowed",
					coupon &&
						(coupon.success
							? `border-teal-500 shadow`
							: `border-red-400 animate-shake`)
				)}
				{...register("couponCode")}
				readOnly={readOnly}
				disabled={readOnly}
			/>
		</div>
	)
}
export default CouponCheckout
