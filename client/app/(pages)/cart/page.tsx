import { UserCart } from "@/components"
import { API } from "@/constant"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
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
	console.log(coupon)
	return (
		<main className="w-main">
			<h1 className="font-bold">User cart</h1>
			<UserCart discount={discount} coupon={coupon} />
		</main>
	)
}
