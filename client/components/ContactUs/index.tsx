"use client"

import dynamic from "next/dynamic"
import { motion } from "framer-motion"

const MapComponent = dynamic(() => import("./MapComponent"), {
	ssr: false,
	loading: () => <p>Loading map...</p>,
})

export default function ContactUs() {
	return (
		<section className="w-full my-8">
			{/* Title */}
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				viewport={{ once: true }}
				className="text-3xl md:text-4xl font-extrabold text-center mb-6 font-bebasNeue"
			>
				Contact <span className="text-red-500 underline">Us</span>
			</motion.h2>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-6xl mx-auto px-4">
				{/* Contact Info */}
				<motion.div
					initial={{ opacity: 0, x: -30 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="bg-white shadow-lg rounded-2xl p-6 flex flex-col justify-center space-y-4"
				>
					<h3 className="text-xl font-bold text-gray-800">Get in Touch</h3>
					<p className="text-gray-600">
						Have questions? Reach out to us anytime — we’d love to hear from
						you.
					</p>

					<div className="space-y-2">
						<p>
							<span className="font-semibold">📍 Address:</span> 123 E-Commerce
							St, Ho Chi Minh City, VN
						</p>
						<p>
							<span className="font-semibold">📞 Phone:</span> +84 123 456 789
						</p>
						<p>
							<span className="font-semibold">✉️ Email:</span>{" "}
							support@shopdemo.com
						</p>
						<p>
							<span className="font-semibold">🕒 Hours:</span> Mon–Fri, 9am –
							6pm
						</p>
					</div>

					{/* Contact Form */}
					<form className="mt-4 space-y-3">
						<input
							type="text"
							placeholder="Your Name"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400"
						/>
						<input
							type="email"
							placeholder="Your Email"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400"
						/>
						<textarea
							placeholder="Your Message"
							className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-red-400"
							rows={4}
						/>
						<button
							type="submit"
							className="w-full bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 transition"
						>
							Send Message
						</button>
					</form>
				</motion.div>

				{/* Map */}
				<motion.div
					initial={{ opacity: 0, x: 30 }}
					whileInView={{ opacity: 1, x: 0 }}
					transition={{ duration: 0.6 }}
					viewport={{ once: true }}
					className="h-[400px] md:h-full rounded-2xl overflow-hidden shadow-lg"
				>
					<MapComponent />
				</motion.div>
			</div>
		</section>
	)
}
