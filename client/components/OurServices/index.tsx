"use client"

import {
	FaExchangeAlt,
	FaGift,
	FaHeadset,
	FaShieldAlt,
	FaShippingFast,
} from "@/assets/icons"
import { motion } from "framer-motion"
import React from "react"

const OurServices = () => {
	const services = [
		{
			icon: <FaShippingFast className="text-blue-500 text-4xl" />,
			title: "Fast & Free Shipping",
			description:
				"Enjoy free and fast shipping on all orders with no minimum purchase required.",
		},
		{
			icon: <FaShieldAlt className="text-green-500 text-4xl" />,
			title: "Secure Payments",
			description:
				"We provide secure payment options to ensure a safe and smooth checkout experience.",
		},
		{
			icon: <FaHeadset className="text-purple-500 text-4xl" />,
			title: "24/7 Customer Support",
			description:
				"Our support team is available around the clock to assist you with any inquiries.",
		},
		{
			icon: <FaExchangeAlt className="text-red-500 text-4xl" />,
			title: "Easy Returns & Exchanges",
			description:
				"Not satisfied with your purchase? Enjoy hassle-free returns and exchanges.",
		},
		{
			icon: <FaGift className="text-yellow-500 text-4xl" />,
			title: "Exclusive Offers & Rewards",
			description:
				"Get access to exclusive discounts, promotions, and rewards for loyal customers.",
		},
	]

	return (
		<section className="flex flex-col items-center justify-center h-full py-10 px-4">
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="text-center mb-6"
			>
				<h2 className="text-center text-3xl font-bold uppercase mb-2 font-bebasNeue border-t-2 border-l-2 border-r-2 border-red-500">
					Our Services
				</h2>
				<p className="max-w-lg text-gray-600 mb-6 italic">
					We are committed to providing the best shopping experience with
					top-notch services designed to make your purchases easy, secure, and
					enjoyable.
				</p>
			</motion.div>
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="text-center text-2xl font-bold uppercase mb-4 font-bebasNeue border-b-2 border-red-500"
			>
				We Offer Best Services
			</motion.div>

			<motion.div
				className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3"
				initial="hidden"
				animate="visible"
				variants={{
					hidden: { opacity: 0 },
					visible: {
						opacity: 1,
						transition: { staggerChildren: 0.1 },
					},
				}}
			>
				{services.map((service, index) => (
					<motion.div
						key={index}
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0 },
						}}
						transition={{ duration: 0.2, ease: "easeOut" }}
						whileHover={{ scale: 1.1 }}
						className="flex flex-col items-center p-2 border rounded-lg shadow-md hover:bg-gray-100 transition"
					>
						{service.icon}
						<h3 className="text-lg font-semibold mt-2 whitespace-nowrap font-poppins">
							{service.title}
						</h3>
						<div className="flex items-center justify-center mt-2">
							<p className="text-sm text-gray-600">{service.description}</p>
						</div>
					</motion.div>
				))}
			</motion.div>
		</section>
	)
}

export default OurServices
