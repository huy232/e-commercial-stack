import { Checkout } from "@/components"
import { API } from "@/constant"
import { Metadata } from "next"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
	title: "Checkout | Digital World",
	description:
		"Review your cart and securely complete your purchase with Digital World. Multiple payment options available for a smooth checkout process.",
	keywords: [
		"Digital World checkout",
		"secure checkout",
		"place order",
		"complete purchase",
		"payment options",
	],
}

export default async function Cart(props: Props) {
	const searchParams = props.searchParams
	const { discount } = searchParams
	let coupon = null

	if (discount) {
		const couponResponse = await fetch(API + `/coupon/` + discount, {
			method: "GET",
			cache: "no-cache",
		})

		const couponData = await couponResponse.json()
		coupon = couponData
	}
	return (
		<main className="w-full lg:w-main">
			<h1 className="font-bold font-bebasNeue text-center text-xl my-2 underline">
				Checkout cart
			</h1>
			<Checkout discount={discount} coupon={coupon} />
		</main>
	)
}
