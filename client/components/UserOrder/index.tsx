"use client"
import { API } from "@/constant"
import { ICoupon, ProfileUser } from "@/types"
import { FC } from "react"
import { CustomImage } from ".."
import { formatPrice } from "../../utils/formatPrice"

interface UserOrderProps {
	user: ProfileUser
	userOrder: any
}

interface Variant {
	price: number
	_id: string
	[key: string]: any
}

interface Product {
	_id: string
	title: string
	thumbnail: string
	allowVariants: boolean
	price: number
}

interface OrderProduct {
	product: Product
	quantity: number
	variant: Variant
}

interface UserOrderItem {
	_id: string
	coupon: null | ICoupon
	orderBy: string
	status: string
	total: number
	products: OrderProduct[]
}

const UserOrder: FC<UserOrderProps> = ({ user, userOrder }) => {
	const { data } = userOrder
	if (data.length === 0) {
		return <div>There's currently no order.</div>
	}
	return (
		<div>
			{data.map((item: UserOrderItem) => (
				<div key={item._id} className="">
					<div className="p-1 text-xs my-1">
						<h3 className="inline-block bg-orange-500 rounded p-1">
							Order ID: {item._id}
						</h3>
					</div>
					<div className="my-1">
						<p className="rounded p-1 text-xs">
							<span className="mr-1">Status</span>
							<span className="bg-green-400 p-1 rounded">{item.status}</span>
						</p>
						{item.coupon && (
							<div className="flex flex-col flex-start p-1">
								<div>
									<span className="text-xs mr-1">Coupon</span>
									<span className="text-xs rounded border-2 border-green-500 p-[2px]">
										{item.coupon.code}
									</span>
								</div>
								<div className="flex">
									{item.coupon.discountType === "percentage" && (
										<span className="text-gray-500 text-xs italic">
											Applied: {item.coupon.discount}% discount
										</span>
									)}
									{item.coupon.discountType === "fixed" && (
										<span className="text-gray-500 text-xs italic">
											Applied: -{item.coupon.discount} discount
										</span>
									)}
								</div>
							</div>
						)}
						<p className="text-xs rounded p-1">
							Total: {formatPrice(item.total)}
						</p>
					</div>
					<div className="grid grid-cols-2 gap-2">
						{item.products.map((product) => (
							<div className="flex flex-row" key={product.product._id}>
								<div className="relative">
									<CustomImage
										src={product.product.thumbnail}
										alt={product.product.title}
										height={120}
										width={120}
										className=""
									/>
									<span className="text-xs absolute top-0 left-0 p-2 bg-black text-white rounded-full w-[30px] h-[30px] flex justify-center items-center">
										{product.quantity}
									</span>
								</div>
								<div>
									<h4 className="line-clamp-2 text-sm font-bold">
										{product.product.title}
									</h4>
									<p className="text-sm flex flex-col">
										<span>Price: {formatPrice(product.product.price)}</span>
										{product.variant && product.variant.price && (
											<span>
												Variant's price: {formatPrice(product.variant.price)}
											</span>
										)}
									</p>
									{product?.variant && (
										<div className="text-xs text-gray-500">
											{Object.entries(product.variant).map(([key, value]) => {
												if (key !== "price" && key !== "_id") {
													return (
														<p className="capitalize" key={key}>
															{key}: {value}
														</p>
													)
												}
											})}
										</div>
									)}
								</div>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}

export default UserOrder
