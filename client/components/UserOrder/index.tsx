"use client"
import { API } from "@/constant"
import { ICoupon, ProfileUser, VariantType } from "@/types"
import { FC } from "react"
import { CustomImage } from ".."
import { formatPrice } from "../../utils/formatPrice"
import { statusConfig } from "@/constant/orderStatus"
import clsx from "clsx"
import { MdOutlinePriceChange, RiCoupon2Fill } from "@/assets/icons"

interface UserOrderProps {
	user: ProfileUser
	userOrder: any
}

interface UserOrderItem {
	_id: string
	coupon: null | ICoupon
	orderBy: string
	status: string
	total: number
	products: {
		product: {
			_id: string
			title: string
			thumbnail: string
			price: number
			discount: {
				type: "percentage" | "fixed"
				value: number
				productPrice: number
			} | null
			variants?: VariantType[]
		}
		variant?: VariantType
		quantity: number
	}[]
}

const UserOrder: FC<UserOrderProps> = ({ userOrder }) => {
	const { data } = userOrder
	if (data.length === 0) {
		return <div>There is currently no order.</div>
	}
	return (
		<>
			{data.map((item: UserOrderItem) => {
				const statusKey = item.status.toLowerCase() as keyof typeof statusConfig
				const statusIcon = statusConfig[statusKey].icon
				return (
					<div
						key={item._id}
						className="bg-gray-800 p-3 my-3 rounded-lg shadow-md"
					>
						<div className="my-1">
							<div className="flex justify-between items-center">
								<span
									className={clsx(
										"font-semibold rounded flex items-center gap-1",
										statusConfig[statusKey].color
									)}
								>
									{statusIcon}
									<span className="mb-[2px]">{item.status}</span>
								</span>
								<div>
									<h3 className="bg-gray-300 inline-block rounded p-1 text-xs text-gray-700">
										Order ID: {item._id}
									</h3>
								</div>
							</div>
							{item.coupon && (
								<div className="flex flex-col justify-end p-1 items-end border-r-2 border-solid border-white mt-2">
									<div className="flex items-center gap-0.5">
										<RiCoupon2Fill className="text-rose-500" size={20} />
										<span className="text-white text-xs rounded p-[2px] underline mb-[1px]">
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
							<p className="text-xs rounded p-1 text-right text-green-500 my-1">
								Total: {formatPrice(item.total)}
							</p>
						</div>
						<div className="grid grid-cols-2 gap-2 bg-white rounded-lg p-2 shadow-heavy">
							{item.products.map((product) => (
								<div className="flex flex-row gap-2" key={product.product._id}>
									<div className="relative flex items-center">
										<CustomImage
											src={product.product.thumbnail}
											alt={product.product.title}
											fill
											className="w-[120px] h-[120px]"
										/>
										<span className="text-xs absolute top-0 left-0 p-2 bg-black text-white rounded-full w-[30px] h-[30px] flex justify-center items-center">
											{product.quantity}
										</span>
									</div>
									<div className="py-1 px-2">
										<h4 className="w-[160px] line-clamp-2 text-sm text-gray-900 font-semibold relative">
											{product.product.title}
										</h4>
										<div className="flex flex-col">
											{product.product.discount ? (
												<div className="flex flex-col text-xs gap-0.5">
													<span className="line-through text-[12px] text-gray-400 italic">
														{formatPrice(product.product.price)}
													</span>
													<div className="flex items-center gap-0.5 text-green-600 text-sm">
														<MdOutlinePriceChange />
														<span className="mb-[1px]">
															{formatPrice(
																product.product.discount.productPrice
															)}
														</span>
													</div>
												</div>
											) : (
												<div className="flex items-center gap-0.5 text-green-600 text-sm">
													<MdOutlinePriceChange />
													<span className="mb-[1px]">
														{formatPrice(product.product.price)}
													</span>
												</div>
											)}

											{!!product.variant && !!product.variant.price && (
												<span className="flex flex-col">
													<span className="text-[12px] text-gray-700">
														(Variant price+)
													</span>
													<span className="text-sm text-green-400">
														{formatPrice(product.variant.price)}
													</span>
												</span>
											)}
										</div>
										{product?.variant && (
											<div className="text-xs text-gray-500 mt-2">
												{product.variant.variant.map((variantObject, key) => {
													return (
														<p className="capitalize" key={key}>
															<span className="text-black">
																{variantObject.type}:{" "}
															</span>
															<span>{variantObject.value}</span>
														</p>
													)
												})}
											</div>
										)}
									</div>
								</div>
							))}
						</div>
					</div>
				)
			})}
		</>
	)
}

export default UserOrder
