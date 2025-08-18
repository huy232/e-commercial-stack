import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
	title: "FAQs | Digital World",
	description:
		"Find answers to the most frequently asked questions about Digital World — from orders and shipping to returns, warranties, and product details. Get the information you need quickly and easily.",
	keywords: [
		"Digital World FAQs",
		"frequently asked questions",
		"order help",
		"shipping information",
		"returns and exchanges",
		"warranty details",
		"product support",
	],
}

const FAQs = dynamic(() => import("@/components/FAQs"), {
	ssr: false,
})

export default function FAQsPage() {
	return <FAQs />
}
