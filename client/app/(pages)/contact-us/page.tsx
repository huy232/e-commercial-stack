import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
	title: "Contact Us | Digital World",
	description:
		"Get in touch with Digital World — our team is here to answer your questions, provide assistance, and ensure your shopping experience is smooth and enjoyable. Reach out via email, phone, or our online contact form.",
	keywords: [
		"Contact Digital World",
		"customer support",
		"get in touch",
		"tech assistance",
		"electronics help",
		"online store contact",
		"customer service",
	],
}

const ContactUs = dynamic(() => import("@/components/ContactUs"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-full">
			<span className="text-gray-500">Loading...</span>
		</div>
	),
})

export default function ContactUsPage() {
	return <ContactUs />
}
