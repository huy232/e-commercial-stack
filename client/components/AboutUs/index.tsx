"use client"

import { useIsClient } from "@/hooks"

import { motion } from "framer-motion"
import { FaShoppingCart, FaTags, FaHeadset, FaUsers } from "react-icons/fa"

const AboutUs = () => {
	const isClient = useIsClient()

	if (!isClient) {
		return null
	}
	const values = [
		{
			title: "Fast & Secure Shopping",
			description: "Experience a seamless and safe online shopping journey.",
			icon: <FaShoppingCart className="text-4xl text-blue-500" />,
		},
		{
			title: "Best Deals & Discounts",
			description:
				"Enjoy exclusive offers and unbeatable prices all year round.",
			icon: <FaTags className="text-4xl text-green-500" />,
		},
		{
			title: "Customer Support",
			description:
				"Our dedicated support team is available 24/7 to assist you.",
			icon: <FaHeadset className="text-4xl text-red-500" />,
		},
		{
			title: "Trusted by Thousands",
			description: "Join a growing community of happy and satisfied shoppers.",
			icon: <FaUsers className="text-4xl text-yellow-500" />,
		},
	]

	return (
		<section className="flex flex-col items-center justify-center px-6 py-12">
			<motion.h1
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="text-3xl font-bold text-center font-bebasNeue"
			>
				About <span className="text-red-500 underline italic">Us</span>
			</motion.h1>

			<motion.p
				initial={{ opacity: 0, y: 10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
				className="mt-4 text-gray-600 text-center max-w-2xl"
			>
				Welcome to our e-commerce platform, where shopping meets convenience. We
				are committed to bringing you the best online shopping experience with a
				wide range of quality products, unbeatable prices, and outstanding
				service.
			</motion.p>

			<motion.div
				className="mt-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6"
				initial="hidden"
				animate="visible"
				variants={{
					hidden: { opacity: 0 },
					visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
				}}
			>
				{values.map((value, index) => (
					<motion.div
						key={index}
						variants={{
							hidden: { opacity: 0, y: 20 },
							visible: { opacity: 1, y: 0 },
						}}
						transition={{ duration: 0.5, ease: "easeOut" }}
						className="flex flex-col items-center p-4 border rounded-lg shadow-md bg-white hover:bg-gray-100 transition"
					>
						{value.icon}
						<h3 className="text-lg font-semibold mt-2 font-bebasNeue whitespace-nowrap">
							{value.title}
						</h3>
						<p className="text-sm text-gray-600 text-center mt-2">
							{value.description}
						</p>
					</motion.div>
				))}
			</motion.div>
		</section>
	)
}

export default AboutUs
