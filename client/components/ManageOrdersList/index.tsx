"use client"
import { OrderType, ProductType } from "@/types"
import { FC, useCallback, useEffect, useState } from "react"
import { Pagination } from "@/components"
import { useSearchParams } from "next/navigation"
import SearchOrders from "./SearchOrders"
import OrdersTableRow from "./OrdersTableRow"
import { API, URL } from "@/constant"

const ManageProducts: FC = () => {
	const [ordersList, setOrdersList] = useState<OrderType[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(true)
	const [ordersListChanged, setOrdersListChanged] = useState(false)
	const params = useSearchParams() as URLSearchParams

	const fetchOrders = useCallback(async (params: any) => {
		setLoading(true)
		try {
			const fetchOrdersResponse = await fetch(
				API + "/order/get-orders?" + new URLSearchParams(params),
				{ method: "GET", credentials: "include" }
			)
			const data = await fetchOrdersResponse.json()
			setOrdersList(data.data)
			setTotalPages(data.totalPages)
		} catch (error) {
			setOrdersList([])
			setTotalPages(1)
			console.error("Error fetching product list:", error)
		} finally {
			setLoading(false)
		}
	}, [])

	useEffect(() => {
		const page = params.has("page") ? Number(params.get("page")) : 1
		const search = params.has("search") ? params.get("search") ?? "" : ""
		const type = params.has("type") ? params.get("type") : ""
		if (search !== "") {
			fetchOrders({ page, search, limit: 10, type })
		} else {
			fetchOrders({ page, limit: 10, type })
		}
	}, [params, ordersListChanged, fetchOrders])

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
