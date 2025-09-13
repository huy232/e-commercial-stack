import { API, WEB_URL } from "@/constant"
import { Metadata } from "next"
import dynamic from "next/dynamic"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
	title: "Your Cart | Digital World",
	description:
		"View and manage the products in your Digital World cart. Update quantities, remove items, and proceed to secure checkout.",
	keywords: [
		"Digital World cart",
		"shopping cart",
		"view cart",
		"manage cart",
		"checkout",
	],
}

const UserCart = dynamic(() => import("@/components/UserCart"), {
	ssr: false,
})

export default async function Cart(props: Props) {
	const searchParams = props.searchParams
	const { discount } = searchParams
	let coupon = null

	if (discount) {
		const couponResponse = await fetch(WEB_URL + `/api/coupon/` + discount, {
			method: "GET",
			cache: "no-cache",
		})

		const couponData = await couponResponse.json()
		coupon = couponData
	}
	return (
		<main className="w-full xl:w-main">
			<h1 className="font-bold text-right font-bebasNeue text-3xl mx-2">
				<span className="mr-1 text-main">User</span>
				<span className="">cart</span>
			</h1>
			<UserCart discount={discount} coupon={coupon} />
		</main>
	)
}
