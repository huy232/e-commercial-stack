"use client"
import { OrderType } from "@/types"
import { redirect } from "next/navigation"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import CustomImage from "../CustomImage"
import { formatPrice } from "@/utils"
import { motion } from "framer-motion"

const OrderSuccess = ({ orderId }: { orderId: string }) => {
	const [loading, setLoading] = useState<boolean>(true)
	const [bill, setBill] = useState<OrderType | null>(null)

	useEffect(() => {
		const fetchUserBill = async () => {
			console.log("Order ID: ", orderId)
			try {
				const billResponse = await fetch(
					`/api/order/specific-order?orderId=${orderId}`,
					{ credentials: "include", method: "GET" }
				)
				const bill = await billResponse.json()
				setBill(bill.data)
			} catch (error) {
				setBill(null)
				console.log("Error while get user bill")
			} finally {
				setLoading(false)
			}
		}
		fetchUserBill()
	}, [orderId])

	// if (loading) {
	return (
		<div className="flex flex-col items-center justify-center h-full gap-4">
			<motion.div
				animate={{ rotate: 360 }}
				transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
				className="w-12 h-12 border-4 border-teal-500 border-t-transparent rounded-full"
			/>
			<span className="text-gray-500">Loading your order details...</span>
		</div>
	)
	// }

	// if (!bill) {
	// 	redirect("/")
	// 	return null
	// }

	// return (
	// 	<section className="flex flex-col items-center justify-start min-h-screen py-10 px-4 lg:px-0 gap-8">
	// 		<motion.div
	// 			initial={{ opacity: 0, scale: 0.5 }}
	// 			animate={{ opacity: 1, scale: 1 }}
	// 			transition={{ duration: 0.6, ease: "easeOut" }}
	// 			className="flex flex-col items-center gap-4"
	// 		>
	// 			<div className="bg-teal-100 rounded-full p-4 flex items-center justify-center">
	// 				<motion.svg
	// 					initial={{ scale: 0 }}
	// 					animate={{ scale: 1 }}
	// 					transition={{ duration: 0.6, ease: "easeOut" }}
	// 					xmlns="http://www.w3.org/2000/svg"
	// 					fill="none"
	// 					viewBox="0 0 24 24"
	// 					stroke="teal"
	// 					className="w-12 h-12"
	// 				>
	// 					<path
	// 						strokeLinecap="round"
	// 						strokeLinejoin="round"
	// 						strokeWidth={2}
	// 						d="M5 13l4 4L19 7"
	// 					/>
	// 				</motion.svg>
	// 			</div>
	// 			<h2 className="text-2xl lg:text-3xl font-bold text-center text-teal-600">
	// 				Payment Completed!
	// 			</h2>
	// 			<p className="text-gray-600 text-center max-w-md">
	// 				Your order has been successfully placed. Here are the details of your
	// 				purchase.
	// 			</p>
	// 		</motion.div>

	// 		<div className="w-full max-w-3xl grid gap-4">
	// 			{bill.products.map((item, index) => (
	// 				<motion.div
	// 					key={index}
	// 					className="flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-300"
	// 					initial={{ opacity: 0, y: 20 }}
	// 					animate={{ opacity: 1, y: 0 }}
	// 					exit={{ opacity: 0, y: -20 }}
	// 				>
	// 					<CustomImage
	// 						src={item.product.thumbnail}
	// 						alt={item.product.title}
	// 						fill
	// 						className="w-[80px] h-[80px] rounded-lg object-cover"
	// 					/>
	// 					<div className="flex-1 flex flex-col">
	// 						<span className="font-semibold">{item.product.title}</span>
	// 						{(item.variant.variant as { type: string; value: string }[]).map(
	// 							(v, idx) => (
	// 								<p className="text-gray-500 text-xs capitalize" key={idx}>
	// 									{v.type}: {v.value}
	// 								</p>
	// 							)
	// 						)}
	// 						<span className="text-sm">Quantity: {item.quantity}</span>
	// 					</div>
	// 					<div className="text-green-500 font-semibold">
	// 						{formatPrice(item.product.price + (item.variant.price || 0))}
	// 					</div>
	// 				</motion.div>
	// 			))}

	// 			<motion.div
	// 				className="border border-teal-500 rounded-lg p-4 mt-4 bg-teal-50"
	// 				initial={{ opacity: 0, y: 20 }}
	// 				animate={{ opacity: 1, y: 0 }}
	// 			>
	// 				<div className="flex justify-between mb-2">
	// 					<span>Coupon Applied:</span>
	// 					<span className="italic text-gray-600">
	// 						{bill.coupon ? bill.coupon.name : "None"}
	// 					</span>
	// 				</div>
	// 				<div className="flex justify-between font-semibold text-green-600">
	// 					<span>Total Bill:</span>
	// 					<span>{formatPrice(bill.total)}</span>
	// 				</div>
	// 			</motion.div>
	// 		</div>

	// 		<motion.div
	// 			whileHover={{ scale: 1.05 }}
	// 			whileTap={{ scale: 0.95 }}
	// 			transition={{ type: "spring", stiffness: 300 }}
	// 		>
	// 			<Link
	// 				href="/"
	// 				className="inline-block mt-4 px-8 py-3 bg-gradient-to-r from-teal-500 to-teal-400 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
	// 			>
	// 				Go to Home
	// 			</Link>
	// 		</motion.div>
	// 	</section>
	// )
}

export default OrderSuccess
