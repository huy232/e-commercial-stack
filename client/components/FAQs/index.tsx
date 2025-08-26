"use client"
import { motion } from "framer-motion"
import Accordion from "../Accordion"

export default function FAQs() {
	return (
		<main className="w-full max-w-[1280px] px-4 sm:px-6 lg:px-8 mx-auto">
			{/* Heading */}
			<motion.h2
				initial={{ opacity: 0, y: 20 }}
				whileInView={{ opacity: 1, y: 0 }}
				viewport={{ once: true, amount: 0.3 }}
				transition={{ duration: 0.8, ease: "easeOut" }}
				className="font-extrabold text-xl sm:text-2xl md:text-3xl lg:text-4xl text-center md:text-right font-bebasNeue"
			>
				<span>Frequently asked</span>
				<span className="text-red-500 underline mx-1">questions</span>
			</motion.h2>

			{/* FAQ List */}
			<div className="my-6 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
				<Accordion title="1. How do I place an order?">
					Simply browse our products, add items to your cart, and proceed to
					checkout. You’ll receive an order confirmation via email.
				</Accordion>
				<Accordion title="2. Do I need an account to make a purchase?">
					No, you can check out as a guest, but creating an account allows you
					to track orders and save your details for faster checkout.
				</Accordion>
				<Accordion title="3. Can I modify or cancel my order after placing it?">
					Orders can be modified or canceled within 30 minutes of placing them.
					Please contact our support team immediately for assistance.
				</Accordion>
				<Accordion title="4. How long does shipping take?">
					Shipping times vary based on your location. Standard shipping takes
					3-7 business days, while express shipping takes 1-3 business days.
				</Accordion>
				<Accordion title="5. Do you offer international shipping?">
					Yes, we ship to select countries. Shipping rates and times vary based
					on the destination.
				</Accordion>
				<Accordion title="6. How can I track my order?">
					Once your order is shipped, you will receive a tracking number via
					email to monitor your shipment’s progress.
				</Accordion>
				<Accordion title="7. What is your return policy?">
					We accept returns within 30 days of purchase. Items must be in their
					original condition and packaging.
				</Accordion>
				<Accordion title="8. How do I request a refund?">
					If your return is approved, refunds will be processed within 5-7
					business days after receiving the returned item.
				</Accordion>
				<Accordion title="9. What payment methods do you accept?">
					We accept credit/debit cards, PayPal, Apple Pay, and Google Pay.
				</Accordion>
				<Accordion title="10. Do you offer discounts or promotions?">
					Yes! Sign up for our newsletter to receive exclusive deals and promo
					codes.
				</Accordion>
			</div>
		</main>
	)
}
