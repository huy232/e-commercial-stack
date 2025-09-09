"use client"
import { FC, useState } from "react"
import { OrderType } from "@/types"
import clsx from "clsx"
import moment from "moment"
import { formatPrice } from "@/utils"
import { API, orderHeaders, sortableOrderFields } from "@/constant"
import { SortableTableHeader, Button } from "@/components"
import { AnimatePresence, motion } from "framer-motion"

interface OrdersTableRowProps {
	orderList: OrderType[] | []
	onOrderListChange: () => void
}

interface ModifiedOrder {
	_id: string
	status: string
}

const OrdersTableRow: FC<OrdersTableRowProps> = ({
	orderList,
	onOrderListChange,
}) => {
	const [loadingRemove, setLoadingRemove] = useState<string[]>([])
	const [enableEdit, setEnableEdit] = useState<boolean>(false)
	const [modifiedOrders, setModifiedOrders] = useState<{
		[key: string]: string // Store the status as the value
	}>({})
	const [orderStatuses, setOrderStatuses] = useState<{ [key: string]: string }>(
		() =>
			Object.fromEntries(orderList.map((order) => [order._id, order.status]))
	)

	const tdClass = (additionClassName?: string) =>
		clsx("hidden lg:table-cell px-1 py-1 align-middle", additionClassName)

	const orderStatus = [
		"Cancelled",
		"Processing",
		"Success",
		"Refund",
		"Delivering",
	]

	// Track the status change of an order
	const handleStatusChange = (orderId: string, newStatus: string) => {
		const originalOrder = orderList.find((order) => order._id === orderId)
		if (!originalOrder) return

		const originalStatus = originalOrder.status

		// Update displayed status
		setOrderStatuses((prev) => ({
			...prev,
			[orderId]: newStatus,
		}))

		// Track changes only if status is different
		setModifiedOrders((prev) => {
			if (originalStatus !== newStatus) {
				return { ...prev, [orderId]: newStatus }
			} else {
				const { [orderId]: _, ...rest } = prev // Remove if status is unchanged
				return rest
			}
		})
	}

	const handleUpdateOrders = async () => {
		const response = await fetch("/api/order/update-orders", {
			body: JSON.stringify(modifiedOrders),
			credentials: "include",
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		})
		// Add your update logic here
		setModifiedOrders({})
		setEnableEdit(false)
		onOrderListChange()
	}

	return (
		<>
			{/* Top Action Buttons */}
			<motion.div
				className="flex justify-end my-4 mx-2 gap-4"
				initial={{ opacity: 0, y: -10 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.3 }}
			>
				<AnimatePresence>
					{enableEdit && (
						<motion.div
							key="update-btn"
							initial={{ opacity: 0, scale: 0.9 }}
							animate={{ opacity: 1, scale: 1 }}
							exit={{ opacity: 0, scale: 0.9 }}
							transition={{ duration: 0.2 }}
						>
							<Button
								onClick={handleUpdateOrders}
								className="ml-4 px-4 py-1 bg-green-500 hover:bg-opacity-80 hover:brightness-110 rounded shadow-sm transition-all"
								disabled={Object.keys(modifiedOrders).length === 0}
								aria-disabled={Object.keys(modifiedOrders).length === 0}
								aria-label="Update modified orders"
								role="button"
								tabIndex={0}
								data-testid="update-orders-button"
								id="update-orders-button"
							>
								Update
							</Button>
						</motion.div>
					)}
				</AnimatePresence>

				<motion.div whileTap={{ scale: 0.9 }}>
					<Button
						className={clsx(
							"rounded px-4 py-1 transition-all duration-200 ease-in-out shadow-sm",
							enableEdit ? "bg-red-500 text-white" : "bg-orange-500 text-white"
						)}
						onClick={() => {
							if (enableEdit) {
								setEnableEdit(false)
								setModifiedOrders({})
								setOrderStatuses(
									Object.fromEntries(
										orderList.map((order) => [order._id, order.status])
									)
								)
							} else {
								setEnableEdit(true)
							}
						}}
						aria-label={enableEdit ? "Cancel editing orders" : "Edit orders"}
						disabled={loadingRemove.length > 0}
						aria-disabled={loadingRemove.length > 0}
						role="button"
						tabIndex={0}
						data-testid="toggle-edit-orders-button"
						id="toggle-edit-orders-button"
					>
						{enableEdit ? "Cancel" : "Edit"}
					</Button>
				</motion.div>
			</motion.div>

			{/* Orders Table */}
			<table className="table-auto mb-6 text-left w-full">
				<SortableTableHeader
					headers={orderHeaders}
					sortableFields={sortableOrderFields}
				/>
				<tbody className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 lg:table-row-group">
					{orderList.map((order, index) => (
						<motion.tr
							key={order._id}
							layout
							initial={{ opacity: 0, y: 10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.25 }}
							className={clsx(
								"rounded block w-fit lg:table-row border text-sm mx-auto bg-white/60 shadow-sm hover:shadow-md transition-all",
								{
									"border-red-500 border-2": modifiedOrders[order._id],
									"border-transparent border-2": !modifiedOrders[order._id],
								}
							)}
						>
							{/* Mobile Card */}
							<div className="lg:hidden w-[280px] md:w-[240px] lg:w-[320px] bg-gray-50 rounded p-2 mb-1 shadow-sm">
								<span className="line-clamp-1 text-sm font-semibold">
									{order._id}
								</span>
								<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
									<dt className="text-xs text-gray-500">Total</dt>
									<dd className="text-xs font-semibold text-green-600">
										{formatPrice(order.total)}
									</dd>
								</div>
								<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
									<dt className="text-xs text-gray-500">Status</dt>
									<dd>
										<select
											name="order-status"
											value={orderStatuses[order._id]}
											disabled={!enableEdit}
											onChange={(e) =>
												handleStatusChange(order._id, e.target.value)
											}
											className="text-xs border rounded px-1 py-0.5 focus:outline-none focus:ring-main transition-all"
										>
											{orderStatus.map((status) => (
												<option key={status} value={status}>
													{status}
												</option>
											))}
										</select>
									</dd>
								</div>
								<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
									<dt className="text-xs text-gray-500">Coupon</dt>
									<dd className="text-xs">{order.coupon?.name || "None"}</dd>
								</div>
								<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
									<dt className="text-xs text-gray-500">Created</dt>
									<dd className="text-xs italic text-gray-500">
										{moment(order.createdAt).fromNow()}
									</dd>
								</div>
							</div>

							{/* Desktop Table Cells */}
							<td className="px-2 py-1">{index + 1}</td>
							<td className="px-2 py-1">{order._id}</td>
							<td className="px-2 py-1">
								{order.orderBy.firstName} {order.orderBy.lastName}
							</td>
							<td className="px-2 py-1">
								<select
									name="order-status"
									value={orderStatuses[order._id]}
									disabled={!enableEdit}
									onChange={(e) =>
										handleStatusChange(order._id, e.target.value)
									}
									className="bg-transparent focus:outline-none"
								>
									{orderStatus.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</td>
							<td className="px-2 py-1">{order.coupon?.name || "None"}</td>
							<td className="px-2 py-1 text-green-600 font-semibold">
								{formatPrice(order.total)}
							</td>
							<td className="px-2 py-1">
								{moment(order.createdAt).format("DD-MM-YYYY")}
							</td>
						</motion.tr>
					))}
				</tbody>
			</table>
		</>
	)
}

export default OrdersTableRow
