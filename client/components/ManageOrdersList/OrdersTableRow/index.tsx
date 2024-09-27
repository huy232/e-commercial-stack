"use client"
import { FC, useState } from "react"
import { OrderType } from "@/types"
import clsx from "clsx"
import moment from "moment"
import { formatPrice } from "@/utils"
import { API } from "@/constant"

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

	const tdClass = (additionClassName?: string) =>
		clsx("px-1 py-1 align-middle", additionClassName)
	const buttonClass = clsx(`text-orange-600 h-full hover-effect`)

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
		if (!originalOrder) {
			return // Exit early if the order is not found
		}
		const originalStatus = originalOrder.status

		// If the status is different from the original status, update the modifiedOrders object
		if (originalStatus !== newStatus) {
			setModifiedOrders((prev) => ({
				...prev,
				[orderId]: newStatus, // Add or update the order with new status
			}))
		} else {
			// If the status matches the original, remove it from modifiedOrders
			setModifiedOrders((prev) => {
				const { [orderId]: _, ...rest } = prev // Destructure to remove orderId
				return rest // Return the updated object without the removed order
			})
		}
	}

	const handleUpdateOrders = async () => {
		console.log("Updating orders...")
		console.log(modifiedOrders) // Log the modified orders with their new statuses
		const response = await fetch(API + "/order/update-orders", {
			body: JSON.stringify(modifiedOrders),
			credentials: "include",
			method: "PUT",
			headers: {
				"Content-Type": "application/json",
			},
		})
		console.log(response.json())
		// Add your update logic here
		setModifiedOrders({})
		setEnableEdit(false)
		onOrderListChange()
	}

	return (
		<>
			<button onClick={() => setEnableEdit(!enableEdit)}>
				{enableEdit ? "Cancel Edit" : "Edit"}
			</button>
			{enableEdit && (
				<button onClick={handleUpdateOrders} className="ml-4">
					Update
				</button>
			)}
			<table className="table-auto mb-6 text-left w-full">
				<thead className="font-bold bg-gray-700 text-[13px] text-white">
					<tr className="border border-blue-300 text-center">
						<td>#</td>
						<td>Order ID</td>
						<td>Customer name</td>
						<td>Status</td>
						<td>Coupon</td>
						<td>Total</td>
						<td>Date</td>
					</tr>
				</thead>
				<tbody className="text-left">
					{orderList.map((order, index) => (
						<tr
							key={order._id}
							className={clsx("border text-sm", {
								"border-red-500 border-2": modifiedOrders[order._id], // Red border if order is modified
								"border-transparent border-2": !modifiedOrders[order._id], // Transparent if not modified
							})}
						>
							<td className={tdClass()}>{index + 1}</td>
							<td className={tdClass()}>{order._id}</td>
							<td className={tdClass(`line-clamp-2 w-[120px]`)}>
								{order.orderBy.lastName}
							</td>
							<td className={tdClass(`text-xs`)}>
								<select
									name="order-status"
									defaultValue={order.status}
									disabled={!enableEdit}
									onChange={(e) =>
										handleStatusChange(order._id, e.target.value)
									}
								>
									{orderStatus.map((status) => (
										<option key={status} value={status}>
											{status}
										</option>
									))}
								</select>
							</td>
							<td className={tdClass("h-full")}>
								{order.coupon ? order.coupon.name : "None"}
							</td>
							<td className={tdClass("h-full")}>{formatPrice(order.total)}</td>
							<td className={tdClass("h-full")}>
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
