"use client"
import { motion } from "framer-motion"
import Link from "next/link"
import React from "react"

const EmptyCart = () => {
	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.4 }}
			className="flex flex-col items-center justify-center w-full py-16 lg:py-32"
		>
			<div className="bg-white shadow-xl border border-gray-200 rounded-2xl p-8 text-center max-w-md w-full">
				<motion.div
					initial={{ scale: 0.95 }}
					animate={{ scale: 1 }}
					transition={{ duration: 0.4, ease: "easeOut" }}
				>
					<h2 className="text-2xl font-bebasNeue font-bold mb-2">
						Your cart is empty
					</h2>
					<p className="text-gray-500 mb-4">
						Looks like you have not added any products yet.
					</p>
					<div className="flex flex-col items-center justify-center">
						<Link
							href="/products"
							className="inline-flex items-center gap-2 py-2 px-6 bg-rose-500 text-white rounded-lg relative overflow-hidden group font-medium transition-all duration-500 hover:bg-gradient-to-r hover:from-rose-500 hover:to-pink-500"
						>
							<span className="relative z-10 transition-transform duration-500 group-hover:-translate-x-1">
								Browse Products
							</span>
							<span className="absolute right-2 opacity-0 transform translate-x-[-5px] transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-100">
								➔
							</span>
						</Link>

						<div className="flex items-center gap-2 my-1">
							<div className="flex-1 border-t border-gray-300"></div>
							<span className="text-gray-500 text-sm">OR</span>
							<div className="flex-1 border-t border-gray-300"></div>
						</div>

						<Link
							href="/"
							className="inline-flex items-center gap-2 py-2 px-6 bg-rose-500 text-white rounded-lg relative overflow-hidden group font-medium transition-all duration-500 hover:bg-gradient-to-r hover:from-pink-500 hover:to-rose-500"
						>
							<span className="absolute left-2 opacity-0 transform -translate-x-5 transition-all duration-500 group-hover:translate-x-0 group-hover:opacity-100">
								🏠︎
							</span>
							<span className="relative z-10 transition-transform duration-500 group-hover:translate-x-1">
								Back to HOME
							</span>
						</Link>
					</div>
				</motion.div>
			</div>
		</motion.div>
	)
}

export default EmptyCart
