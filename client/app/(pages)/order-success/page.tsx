"use client"
import { CustomImage } from "@/components"
import { API } from "@/constant"
import { OrderType } from "@/types"
import { formatPrice, path } from "@/utils"
import Link from "next/link"
import { format } from "path"
import { useEffect, useState } from "react"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

const UserOrder = (props: Props) => {
	const orderId = props.searchParams.orderId as string | undefined

	const [loading, setLoading] = useState<boolean>(true)
	const [bill, setBill] = useState<OrderType | null>(null)

	const fetchUserBill = async () => {
		try {
			const billResponse = await fetch(
				API + `/order/specific-order?orderId=${orderId}`,
				{ credentials: "include", method: "GET" }
			)
			const bill = await billResponse.json()
			setBill(bill.data)
			setLoading(false)
		} catch (error) {
			setBill(null)
			setLoading(false)
			console.log("Error while get user bill")
		}
	}
	useEffect(() => {
		fetchUserBill()
	}, [])
	return (
		<section className="flex flex-col items-center justify-center h-full">
			<h2 className="text-center font-bold uppercase">
				Payment completed, billing information
			</h2>

			{!loading && bill ? (
				<div>
					{bill.products.map((item) => (
						<div className="flex flex-row">
							<CustomImage
								src={item.product.thumbnail}
								height={120}
								width={120}
								alt={item.product.title}
							/>
							<div className="flex flex-col">
								<span className="font-semibold">{item.product.title}</span>
								{Object.entries(item.variant).map(([key, value]) => {
									if (key !== "price" && key !== "_id" && key !== "stock") {
										return (
											<p className="capitalize text-gray-500 text-xs" key={key}>
												{key}: {String(value)}
											</p>
										)
									}
								})}
								<span className="text-sm">Quantity: {item.quantity}</span>
								<span className="text-sm text-green-500">
									{formatPrice(item.product.price + (item.variant.price || 0))}
								</span>
							</div>
						</div>
					))}
					<div className="flex flex-col">
						<span>
							Coupon applied: {bill.coupon ? bill.coupon.name : "None"}
						</span>
						<span>Total bill: {formatPrice(bill.total)}</span>
					</div>
				</div>
			) : (
				"Loading"
			)}
		</section>
	)
}

export default UserOrder
