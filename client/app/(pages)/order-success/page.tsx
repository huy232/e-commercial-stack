"use client"
import { CustomImage } from "@/components"
import { API } from "@/constant"
import { OrderType } from "@/types"
import { formatPrice } from "@/utils"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

const UserOrder = (props: Props) => {
	const orderId = props.searchParams.orderId as string | undefined
	const [loading, setLoading] = useState<boolean>(true)
	const [bill, setBill] = useState<OrderType | null>(null)
	useEffect(() => {
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
		fetchUserBill()
	}, [orderId])

	if (loading) {
		return <span>Loading</span>
	}

	if (!bill) {
		return redirect("/")
	}

	return (
		<section className="flex flex-col items-center justify-center h-full">
			{bill && (
				<>
					<h2 className="text-center font-bold uppercase">
						Payment completed, billing information
					</h2>
					<div>
						{bill.products.map((item, index) => (
							<div className="flex flex-row items-center" key={index}>
								<CustomImage
									src={item.product.thumbnail}
									alt={item.product.title}
									fill
									className="w-[120px] h-[120px]"
								/>
								<div className="flex flex-col">
									<span className="font-semibold">{item.product.title}</span>

									{item.variant.variant.map(
										(
											variantItem: {
												type: string
												value: string
											},
											index: number
										) => {
											return (
												<p
													className="capitalize text-gray-500 text-xs"
													key={index}
												>
													{variantItem.type}: {variantItem.value}
												</p>
											)
										}
									)}
									<span className="text-sm">Quantity: {item.quantity}</span>
									<span className="text-sm text-green-500 font-semibold">
										{formatPrice(
											item.product.price + (item.variant.price || 0)
										)}
									</span>
								</div>
							</div>
						))}
						<div className="flex flex-col border-rose-500 border-2 rounded p-2 mt-2 mb-4">
							<span className="flex gap-1 items-center">
								<span className="">Coupon applied:</span>
								<span className="italic text-gray-600">
									{bill.coupon ? bill.coupon.name : "None"}
								</span>
							</span>
							<span className="flex gap-1 items-center">
								<span className="">Total bill:</span>
								<span className="text-green-500 font-semibold">
									{formatPrice(bill.total)}
								</span>
							</span>
						</div>
					</div>
				</>
			)}
		</section>
	)
}

export default UserOrder
