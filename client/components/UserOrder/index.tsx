"use client"
import { ICoupon, ProfileUser, VariantType } from "@/types"
import { FC } from "react"
import { CustomImage } from ".."
import { formatPrice } from "../../utils/formatPrice"
import { statusConfig } from "@/constant/orderStatus"
import clsx from "clsx"
import {
	MdOutlinePriceChange,
	RiCoupon2Fill,
	FaUser,
	FaPhoneAlt,
	FaMapMarkerAlt,
} from "@/assets/icons"
import { motion } from "framer-motion"

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
	notes?: string
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
				expirationDate: Date
			} | null
			variants?: VariantType[]
		}
		variant?: VariantType
		quantity: number
	}[]
}

const UserOrder: FC<UserOrderProps> = ({ user, userOrder }) => {
	const { data } = userOrder
	if (!data || data.length === 0) {
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
						className="bg-gray-800 p-3 my-3 rounded-lg shadow-md mx-2"
					>
						{/* Header: status + id */}
						<div className="my-1">
							<div className="md:flex md:justify-between items-center">
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
								<motion.div
									initial={{ opacity: 0, y: -5 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.3 }}
									className="flex flex-col items-end bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-400 rounded-md p-2 mt-2 shadow-sm w-fit mx-auto md:ml-auto md:mr-0"
								>
									<div className="flex items-center gap-1">
										<RiCoupon2Fill className="text-rose-600" size={20} />
										<span className="bg-rose-500 text-white text-xs font-bold px-2 py-[2px] rounded">
											{item.coupon.code}
										</span>
									</div>

									<div className="flex mt-1">
										{item.coupon.discountType === "percentage" && (
											<span className="text-green-700 text-sm font-semibold">
												🎉 {item.coupon.discount}% OFF applied
											</span>
										)}
										{item.coupon.discountType === "fixed" && (
											<span className="text-red-700 text-sm font-semibold">
												💸 -{formatPrice(item.coupon.discount)} discount
											</span>
										)}
									</div>
								</motion.div>
							)}

							<p className="text-xs rounded p-1 text-right text-green-500 my-1">
								Total: {formatPrice(item.total)}
							</p>
						</div>

						<div className="bg-white rounded-md p-3 mb-3 shadow">
							<h4 className="font-semibold text-gray-800 mb-2 text-sm">
								Billing Information
							</h4>
							<div className="space-y-1 text-sm text-gray-600">
								<p className="flex items-start md:items-center gap-2">
									<FaUser
										className="text-blue-500 w-[20px] h-[20px] shrink-0"
										size={20}
									/>{" "}
									<span>{user?.address?.name || "N/A"}</span>
								</p>
								<p className="flex items-start md:items-center gap-2">
									<FaPhoneAlt
										className="text-green-500 w-[20px] h-[20px] shrink-0"
										size={20}
									/>{" "}
									<span>{user?.address?.phone || "N/A"}</span>
								</p>
								<p className="flex items-start md:items-center gap-2">
									<FaMapMarkerAlt
										className="text-red-500 w-[20px] h-[20px] shrink-0"
										size={20}
									/>
									<span>
										{[
											user?.address?.line1,
											user?.address?.line2,
											user?.address?.city,
											user?.address?.state,
											user?.address?.postal_code,
											user?.address?.country,
										]
											.filter(Boolean)
											.join(", ") || "N/A"}
									</span>
								</p>
							</div>
						</div>

						{item.notes && item.notes.trim().length > 0 && (
							<motion.div
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-3 mb-3"
							>
								<div className="flex items-start gap-3">
									<div className="text-2xl leading-none">📝</div>
									<div>
										<h5 className="text-sm font-semibold text-yellow-800">
											Your note for this order
										</h5>
										<p className="text-sm text-gray-700 mt-1 whitespace-pre-wrap">
											{item.notes}
										</p>
									</div>
								</div>
							</motion.div>
						)}

						{/* Products */}
						<div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2 bg-white rounded-lg p-2 shadow-heavy">
							{item.products.map((product, index) => (
								<div
									className="flex flex-col md:flex-row gap-2 max-sm:border-b-2 max-sm:border-black/20 pb-2 max-sm:last:border-b-0 hover:shadow-lg transition-shadow duration-300"
									key={`${product.product._id}-${
										product.variant?._id || index
									}`}
								>
									{/* Product image */}
									<div className="relative flex items-center w-[120px] h-[120px]">
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

									{/* Product info */}
									<div className="py-1 px-2">
										<h4 className="w-[160px] h-[54px] text-sm text-gray-900 font-semibold relative">
											<span className="line-clamp-2">
												{product.product.title}
											</span>
										</h4>

										<div className="flex flex-col">
											{product.product.discount &&
											new Date(product.product.discount.expirationDate) >
												new Date() ? (
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
										</div>

										{/* Variants */}
										{product?.variant && (
											<div className="text-xs text-gray-500 mt-2">
												{product.variant.variant.map((variantObject, key) => (
													<p className="capitalize" key={key}>
														<span className="text-black">
															{variantObject.type}:{" "}
														</span>
														<span>{variantObject.value}</span>
													</p>
												))}
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
