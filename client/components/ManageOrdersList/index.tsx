"use client"
import { OrderType, ProductType } from "@/types"
import { FC, useCallback, useEffect, useState } from "react"
import { Pagination } from "@/components"
import { useSearchParams } from "next/navigation"
import SearchOrders from "./SearchOrders"
import OrdersTableRow from "./OrdersTableRow"
import { WEB_URL } from "@/constant"

const ManageProducts: FC = () => {
	const [ordersList, setOrdersList] = useState<OrderType[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(true)
	const [ordersListChanged, setOrdersListChanged] = useState(false)
	const params = useSearchParams() as URLSearchParams

	const fetchOrders = useCallback(async () => {
		setLoading(true)
		try {
			const queryParams: Record<string, string> = {}
			params.forEach((value, key) => {
				queryParams[key] = value
			})
			// Ensure default pagination limit is set if not provided
			if (!queryParams.limit) {
				queryParams.limit = "10"
			}

			const queryString = new URLSearchParams(queryParams).toString()
			const fetchOrdersResponse = await fetch(
				WEB_URL + `/api/order/get-orders?${queryString}`,
				{ method: "GET", credentials: "include" }
			)
			const data = await fetchOrdersResponse.json()

			console.log("Fetched orders data:")
			console.log(data)

			setOrdersList(data.data)
			setTotalPages(data.totalPages)
		} catch (error) {
			setOrdersList([])
			setTotalPages(1)
			console.error("Error fetching product list:", error)
		} finally {
			setLoading(false)
		}
	}, [params])

	useEffect(() => {
		fetchOrders()
	}, [fetchOrders, params, ordersListChanged])

	const handleOrdersListChange = () => {
		setOrdersListChanged((prevState) => !prevState)
	}

	return (
		<div className="w-full p-4">
			{!loading && (
				<>
					<SearchOrders />
					<OrdersTableRow
						orderList={ordersList}
						onOrderListChange={handleOrdersListChange}
					/>
					<Pagination totalPages={totalPages} />
				</>
			)}
		</div>
	)
}

export default ManageProducts
