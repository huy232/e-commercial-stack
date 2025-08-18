import dynamic from "next/dynamic"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "About Us | Digital World",
	description:
		"Learn more about Digital World — our mission, values, and commitment to delivering cutting-edge technology and exceptional customer service. Discover who we are and why we're passionate about all things tech.",
	keywords: [
		"About Digital World",
		"Digital World team",
		"company values",
		"e-commerce tech company",
		"technology experts",
		"trusted electronics store",
	],
}

// Lazy load your client component
const AboutUs = dynamic(() => import("@/components/AboutUs"), { ssr: false })

export default function AboutPage() {
	return <AboutUs />
}
