"use client"
import { FC, useEffect, useState } from "react"
import { OrderType } from "@/types"
import clsx from "clsx"
import moment from "moment"
import { formatPrice } from "@/utils"
import { orderHeaders, sortableOrderFields } from "@/constant"
import { SortableTableHeader, Button } from "@/components"
import { AnimatePresence, motion } from "framer-motion"
import {
	FaUser,
	FaPhoneAlt,
	FaMapMarkerAlt,
	FaStickyNote,
} from "react-icons/fa"

interface OrdersTableRowProps {
	orderList: OrderType[] | []
	onOrderListChange: () => void
	loading: boolean
}

const OrdersTableRow: FC<OrdersTableRowProps> = ({
	orderList,
	onOrderListChange,
	loading,
}) => {
	const [enableEdit, setEnableEdit] = useState(false)
	const [modifiedOrders, setModifiedOrders] = useState<{
		[key: string]: string
	}>({})
	const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: string }>(
		{}
	)
	const [expandedRow, setExpandedRow] = useState<string | null>(null)

	const idToStr = (id: any) =>
		typeof id === "string" ? id : id?.toString?.() ?? String(id)

	useEffect(() => {
		const map = Object.fromEntries(
			orderList.map((o) => [idToStr(o._id), o.status])
		)
		setOrderStatuses(map)
		setModifiedOrders({})
	}, [orderList])

	const orderStatus = [
		"Cancelled",
		"Processing",
		"Success",
		"Refund",
		"Delivering",
	]

	const handleStatusChange = (orderId: string, newStatus: string) => {
		const originalOrder = orderList.find((o) => idToStr(o._id) === orderId)
		if (!originalOrder) return
		const originalStatus = originalOrder.status

		setOrderStatuses((prev) => ({ ...prev, [orderId]: newStatus }))
		setModifiedOrders((prev) =>
			originalStatus !== newStatus
				? { ...prev, [orderId]: newStatus }
				: (() => {
						const { [orderId]: _, ...rest } = prev
						return rest
				  })()
		)
	}

	const handleUpdateOrders = async () => {
		await fetch("/api/order/update-orders", {
			method: "PUT",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(modifiedOrders),
		})
		setModifiedOrders({})
		setEnableEdit(false)
		onOrderListChange()
	}

	// 🔹 Mobile Card view
	const MobileCard = ({ order }: { order: OrderType }) => {
		const id = idToStr(order._id)
		return (
			<div
				key={id}
				className={clsx(
					"bg-white/70 shadow-sm hover:shadow-md rounded p-3 transition-all",
					modifiedOrders[id] ? "border-2 border-red-500" : "border"
				)}
			>
				{/* Order Summary */}
				<span className="line-clamp-1 text-sm font-semibold">{order._id}</span>

				<div className="grid grid-cols-[80px_auto] gap-1 mt-2 text-xs">
					<span className="text-gray-500">Total</span>
					<span className="font-semibold text-green-600">
						{formatPrice(order.total)}
					</span>
				</div>

				<div className="grid grid-cols-[80px_auto] gap-1 mt-1 text-xs">
					<span className="text-gray-500">Status</span>
					<select
						value={orderStatuses[id] ?? order.status}
						disabled={!enableEdit}
						onChange={(e) => handleStatusChange(id, e.target.value)}
						className="border rounded px-1 py-0.5 text-xs focus:outline-none"
					>
						{orderStatus.map((s) => (
							<option key={s} value={s}>
								{s}
							</option>
						))}
					</select>
				</div>

				<div className="grid grid-cols-[80px_auto] gap-1 mt-1 text-xs">
					<span className="text-gray-500">Coupon</span>
					<span>{order.coupon?.name || "None"}</span>
				</div>

				<div className="grid grid-cols-[80px_auto] gap-1 mt-1 text-xs">
					<span className="text-gray-500">Created</span>
					<span className="italic text-gray-500">
						{moment(order.createdAt).fromNow()}
					</span>
				</div>

				{/* Billing Info */}
				<div className="mt-3 border-t pt-2 text-xs text-gray-700 space-y-1">
					<p className="flex items-center gap-1">
						<FaUser className="text-blue-500" /> {order.orderBy.firstName}
						{order.orderBy.lastName}
					</p>
					<p className="flex items-center gap-1">
						<FaPhoneAlt className="text-green-500" />
						{order.shippingAddress.phone || "N/A"}
					</p>
					<p className="flex items-start gap-1">
						<FaMapMarkerAlt className="text-red-500 mt-0.5" />
						<div className="space-y-1 text-gray-600">
							<p>
								<span className="font-medium">Line 1: </span>
								{order.shippingAddress.line1 || "None"}
							</p>
							<p>
								<span className="font-medium">Line 2: </span>
								{order.shippingAddress.line2 || "None"}
							</p>
							<p>
								<span className="font-medium">City: </span>
								{order.shippingAddress.city || "N/A"}
							</p>
							<p>
								<span className="font-medium">State: </span>
								{order.shippingAddress.state || "N/A"}
							</p>
							<p>
								<span className="font-medium">Postal Code: </span>
								{order.shippingAddress.postal_code || "N/A"}
							</p>
							<p>
								<span className="font-medium">Country: </span>
								{order.shippingAddress.country || "N/A"}
							</p>
						</div>
					</p>
				</div>

				{/* Note */}
				{order.notes && (
					<div className="mt-2 bg-yellow-50 border-l-4 border-yellow-400 rounded p-2 text-xs">
						<p className="flex items-center gap-1 font-semibold text-yellow-800">
							<FaStickyNote /> Note
						</p>
						<p className="mt-1 whitespace-pre-wrap text-gray-700">
							{order.notes}
						</p>
					</div>
				)}
			</div>
		)
	}

	return (
		<>
			{/* Top buttons */}
			<div className="flex justify-end gap-3 mb-4">
				{enableEdit && (
					<Button
						onClick={handleUpdateOrders}
						disabled={Object.keys(modifiedOrders).length === 0}
						className="px-4 py-1 bg-green-500 text-white rounded"
					>
						Update
					</Button>
				)}
				<Button
					className={clsx(
						"px-4 py-1 rounded text-white",
						enableEdit ? "bg-red-500" : "bg-orange-500"
					)}
					onClick={() => {
						if (enableEdit) {
							setEnableEdit(false)
							setModifiedOrders({})
							setOrderStatuses(
								Object.fromEntries(
									orderList.map((o) => [idToStr(o._id), o.status])
								)
							)
						} else setEnableEdit(true)
					}}
				>
					{enableEdit ? "Cancel" : "Edit"}
				</Button>
			</div>

			{/* Mobile Cards */}
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:hidden">
				{loading
					? Array.from({ length: 6 }).map((_, i) => (
							<div
								key={i}
								className="animate-pulse bg-white rounded p-3 h-32"
							></div>
					  ))
					: orderList.map((order: OrderType) => (
							<MobileCard key={idToStr(order._id)} order={order} />
					  ))}
			</div>

			{/* Desktop Table */}
			<table className="hidden lg:table w-full text-sm mb-6">
				<SortableTableHeader
					headers={orderHeaders}
					sortableFields={sortableOrderFields}
				/>
				<tbody>
					{orderList.map((order, index) => {
						const id = idToStr(order._id)
						return (
							<>
								<motion.tr
									key={id}
									layout
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className={clsx(
										"bg-white/60 border-b hover:bg-gray-50 transition",
										modifiedOrders[id] && "border-2 border-red-500"
									)}
								>
									<td className="px-2 py-2">{index + 1}</td>
									<td className="px-2 py-2">{order._id}</td>
									<td className="px-2 py-2">
										{order.orderBy.firstName} {order.orderBy.lastName}
									</td>
									<td className="px-2 py-2">
										<select
											value={orderStatuses[id] ?? order.status}
											disabled={!enableEdit}
											onChange={(e) => handleStatusChange(id, e.target.value)}
											className="bg-transparent"
										>
											{orderStatus.map((s) => (
												<option key={s} value={s}>
													{s}
												</option>
											))}
										</select>
									</td>
									<td className="px-2 py-2">{order.coupon?.name || "None"}</td>
									<td className="px-2 py-2 text-green-600">
										{formatPrice(order.total)}
									</td>
									<td className="px-2 py-2">
										{moment(order.createdAt).format("DD-MM-YYYY")}
									</td>
								</motion.tr>

								<AnimatePresence>
									<motion.tr
										initial={{ opacity: 0, y: -10 }}
										animate={{ opacity: 1, y: 0 }}
										exit={{ opacity: 0, y: -10 }}
										className="bg-gray-50 border-b-2 border-slate-700 border-solid"
									>
										<td colSpan={7} className="px-1 py-2">
											<div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6 text-xs text-gray-700">
												<div className="bg-white rounded-lg shadow px-1 border">
													<h4 className="font-semibold mb-3 text-gray-800">
														Billing Info
													</h4>

													<div className="flex items-center gap-2 mb-2">
														<FaUser className="text-blue-500" />
														<span className="font-medium text-gray-700">
															{order.shippingAddress.name || "N/A"}
														</span>
													</div>

													<div className="flex items-center gap-2 mb-2">
														<FaPhoneAlt className="text-green-500" />
														<span className="text-gray-600">
															{order.shippingAddress.phone || "N/A"}
														</span>
													</div>

													<div className="flex items-start gap-2">
														<FaMapMarkerAlt className="text-red-500 mt-1" />
														<div className="space-y-1 text-gray-600">
															<p>
																<span className="font-medium">Line 1: </span>
																{order.shippingAddress.line1 || "None"}
															</p>
															<p>
																<span className="font-medium">Line 2: </span>
																{order.shippingAddress.line2 || "None"}
															</p>
															<p>
																<span className="font-medium">City: </span>
																{order.shippingAddress.city || "N/A"}
															</p>
															<p>
																<span className="font-medium">State: </span>
																{order.shippingAddress.state || "N/A"}
															</p>
															<p>
																<span className="font-medium">
																	Postal Code:{" "}
																</span>
																{order.shippingAddress.postal_code || "N/A"}
															</p>
															<p>
																<span className="font-medium">Country: </span>
																{order.shippingAddress.country || "N/A"}
															</p>
														</div>
													</div>
												</div>

												{order.notes && (
													<div className="bg-yellow-50 border-l-4 border-yellow-400 rounded p-2">
														<p className="flex items-center gap-1 font-semibold text-yellow-800">
															<FaStickyNote /> Note
														</p>
														<p className="mt-1 whitespace-pre-wrap text-gray-700">
															{order.notes}
														</p>
													</div>
												)}
											</div>
										</td>
									</motion.tr>
								</AnimatePresence>
							</>
						)
					})}
				</tbody>
			</table>
		</>
	)
}

export default OrdersTableRow
