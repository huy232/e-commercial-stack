"use client"
import { useSearchParams } from "next/navigation"
import { XCircle, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function CheckoutCancelPage() {
	const params = useSearchParams()
	const error = params.get("error")

	const getErrorMessage = () => {
		switch (error) {
			case "missing_fields":
				return "Your billing details were incomplete. Please fill in all required fields and try again."
			case "payment_failed":
				return "Your payment could not be processed. Please check your card details or try another method."
			default:
				return "Something went wrong during checkout. Please try again."
		}
	}

	return (
		<div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 px-6">
			<motion.div
				className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full text-center"
				initial={{ opacity: 0, y: 50, scale: 0.9 }}
				animate={{ opacity: 1, y: 0, scale: 1 }}
				transition={{ duration: 0.5, ease: "easeOut" }}
			>
				<motion.div
					initial={{ scale: 0 }}
					animate={{ scale: 1, rotate: 360 }}
					transition={{ type: "spring", stiffness: 200, damping: 15 }}
				>
					<XCircle className="mx-auto text-red-500 w-20 h-20 mb-4" />
				</motion.div>

				<motion.h1
					className="text-3xl font-bold text-gray-800"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.3, duration: 0.4 }}
				>
					Checkout Failed
				</motion.h1>

				<motion.p
					className="mt-3 text-gray-600"
					initial={{ opacity: 0, y: 10 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.4, duration: 0.4 }}
				>
					{getErrorMessage()}
				</motion.p>

				<motion.div
					className="mt-6 space-y-3"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.6, duration: 0.4 }}
				>
					<Link
						href="/checkout"
						className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl bg-red-500 text-white font-medium hover:bg-red-600 transition"
					>
						Try Again
					</Link>
					<Link
						href="/cart"
						className="inline-flex items-center justify-center w-full px-4 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-100 transition"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Cart
					</Link>
				</motion.div>
			</motion.div>
		</div>
	)
}
