"use client"
import { FC, useState } from "react"
import { OrderType } from "@/types"
import clsx from "clsx"
import moment from "moment"
import { formatPrice } from "@/utils"
import { API, orderHeaders, sortableOrderFields } from "@/constant"
import { SortableTableHeader } from "@/components"

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
		const response = await fetch(API + "/order/update-orders", {
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
			<div className="flex justify-end my-4 mx-2 gap-4">
				{enableEdit && (
					<button
						onClick={handleUpdateOrders}
						className="ml-4 px-4 py-1 bg-green-500 hover:bg-opacity-80 hover:brightness-110 duration-300 ease-in-out rounded"
					>
						Update
					</button>
				)}
				<button
					className={clsx(
						"rounded px-4 py-1 hover:bg-opacity-80 hover:brightness-110 duration-300 ease-in-out",
						enableEdit ? "bg-red-500 text-white" : "bg-orange-500 text-white"
					)}
					onClick={() => {
						if (enableEdit) {
							setEnableEdit(false)
							setModifiedOrders({})
							// Reset statuses back to original orderList values
							setOrderStatuses(
								Object.fromEntries(
									orderList.map((order) => [order._id, order.status])
								)
							)
						} else {
							setEnableEdit(true)
						}
					}}
				>
					{enableEdit ? "Cancel" : "Edit"}
				</button>
			</div>
			<table className="table-auto mb-6 text-left w-full">
				<SortableTableHeader
					headers={orderHeaders}
					sortableFields={sortableOrderFields}
				/>
				<tbody className="text-left grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 lg:table-row-group">
					{orderList.map((order, index) => (
						<tr
							key={order._id}
							className={clsx(
								"rounded block w-fit lg:table-row border text-sm mx-auto",
								{
									"border-red-500 border-2": modifiedOrders[order._id], // Red border if order is modified
									"border-transparent border-2": !modifiedOrders[order._id], // Transparent if not modified
								}
							)}
						>
							<div className="lg:hidden w-[280px] md:w-[240px] lg:w-[320px] bg-gray-400/40 rounded p-1 mb-1">
								<span className="line-clamp-1 text-sm font-semibold whitespace-break-spaces">
									{order._id}
								</span>
								<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
									<dt className="text-xs">Total</dt>
									<dd className="text-xs bg-gray-600/30 rounded px-1 shadow-md inline w-fit">
										{formatPrice(order.total)}
									</dd>
								</div>
								<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
									<dt className="text-xs">Status</dt>
									<dd className="text-xs bg-gray-600/30 rounded px-1 shadow-md inline w-fit">
										<select
											name="order-status"
											value={orderStatuses[order._id]} // Controlled component
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
									</dd>
								</div>
								<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
									<dt className="text-xs">Coupon</dt>
									<dd className="text-xs bg-gray-600/30 rounded px-1 shadow-md inline w-fit">
										{order.coupon ? order.coupon.name : "None"}
									</dd>
								</div>
								<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
									<dt className="text-xs">Created</dt>
									<dd className="text-xs italic text-gray-500">
										{moment(order.createdAt).fromNow()}
									</dd>
								</div>
							</div>

							<td className={tdClass()}>{index + 1}</td>
							<td className={tdClass("w-[240px]")}>{order._id}</td>
							<td className={tdClass(`line-clamp-2 w-[120px]`)}>
								{order.orderBy.firstName} {order.orderBy.lastName}
							</td>
							<td className={tdClass(`text-xs`)}>
								<select
									name="order-status"
									value={orderStatuses[order._id]} // Controlled component
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
							<td className={tdClass("h-full line-clamp-2")}>
								{order.coupon ? order.coupon.name : "None"}
							</td>
							<td
								className={tdClass("h-full text-xs text-green-500 text-right")}
							>
								{formatPrice(order.total)}
							</td>
							<td className={tdClass("h-full text-right")}>
								{moment(order.createdAt).format("DD-MM-YYYY")}
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</>
	)
}

export default OrdersTableRow
