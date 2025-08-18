import { Metadata } from "next"
import dynamic from "next/dynamic"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
	title: "Our Services | Digital World",
	description:
		"Explore the wide range of services offered by Digital World — from expert product recommendations and fast shipping to exceptional after-sales support. We are dedicated to providing a seamless shopping experience for all your tech needs.",
	keywords: [
		"Digital World services",
		"technology solutions",
		"online shopping support",
		"fast shipping",
		"electronics repair",
		"tech consultations",
		"customer service excellence",
	],
}
const OurServices = dynamic(() => import("@/components/OurServices"), {
	ssr: false,
	loading: () => (
		<div className="flex items-center justify-center h-full">
			<span className="text-gray-500">Loading...</span>
		</div>
	),
})

export default function OurServicesPage(props: Props) {
	return <OurServices />
}
