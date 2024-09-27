"use client"

import React, { useEffect, useState } from "react"
import { CustomImage, OrdersChart } from "@/components"
import { API, BASE_SERVER_URL } from "@/constant"
import io, { Socket } from "socket.io-client"
import { OrderType } from "@/types"
import { formatPrice } from "@/utils"

interface MonthlyOrderData {
	month: number
	value: number
}

interface ProductDistribution {
	_id: string
	count: number
}

let socket: Socket | null = null

export default function AdminDashboard() {
	const [orderCountData, setOrderCountData] = useState<MonthlyOrderData[]>([])
	const [orderSumData, setOrderSumData] = useState<MonthlyOrderData[]>([])
	const [productDistributionData, setProductDistributionData] = useState<
		ProductDistribution[]
	>([])

	const [onlineUsers, setOnlineUsers] = useState(0) // To track online users
	const [totalPageVisits, setTotalPageVisits] = useState(0) // To track total page visits
	const [newestOrders, setNewestOrders] = useState<OrderType[] | []>([])

	const [loadingCount, setLoadingCount] = useState(true)
	const [loadingSum, setLoadingSum] = useState(true)
	const [loadingDistribution, setLoadingDistribution] = useState(true)

	// Fetch order count by month
	const fetchOrderCountByMonth = async () => {
		try {
			const response = await fetch(`${API}/order/monthly`, {
				method: "GET",
				credentials: "include",
			})
			const result = await response.json()

			if (result.success) {
				const data = result.data.map((item: any) => ({
					month: item.month,
					value: item.count,
				}))
				setOrderCountData(data)
			}
		} catch (error) {
			console.error("Error fetching order count:", error)
		} finally {
			setLoadingCount(false)
		}
	}

	// Fetch total order sum by month
	const fetchOrderSumByMonth = async () => {
		try {
			const response = await fetch(`${API}/order/monthly-price`, {
				method: "GET",
				credentials: "include",
			})
			const result = await response.json()

			if (result.success) {
				const data = result.data.map((item: any) => ({
					month: item._id.month,
					value: item.totalAmount,
				}))
				setOrderSumData(data)
			}
		} catch (error) {
			console.error("Error fetching order sum:", error)
		} finally {
			setLoadingSum(false)
		}
	}

	// Fetch product distribution data
	const fetchProductDistribution = async () => {
		try {
			const response = await fetch(`${API}/product/product-distribution`, {
				method: "GET",
				credentials: "include",
			})
			const result = await response.json()
			setProductDistributionData(result) // Assuming the response has the distribution data
		} catch (error) {
			console.error("Error fetching product distribution:", error)
		} finally {
			setLoadingDistribution(false)
		}
	}

	// Fetch total page visits
	const trackPageVisit = async () => {
		try {
			const response = await fetch(`${API}/visit/monthly-visit`, {
				method: "GET",
				credentials: "include",
			})
			const result = await response.json()
			setTotalPageVisits(result.visitCount)
		} catch (error) {
			console.error("Error tracking page visit:", error)
		}
	}

	const fetchNewestOrders = async () => {
		try {
			const response = await fetch(`${API}/order/newest-order`, {
				method: "GET",
				credentials: "include",
			})
			const result = await response.json()
			setNewestOrders(result.data)
		} catch (error) {
			console.error("Error tracking page visit:", error)
		}
	}

	// Set up real-time updates
	useEffect(() => {
		fetchOrderCountByMonth()
		fetchOrderSumByMonth()
		trackPageVisit()
		fetchProductDistribution()
		fetchNewestOrders()

		if (!socket) {
			// Initialize socket connection
			socket = io(BASE_SERVER_URL as string, {
				withCredentials: true,
			})

			// Listen for real-time updates
			socket.on("orderUpdated", async () => {
				await fetchOrderCountByMonth()
				await fetchOrderSumByMonth()
			})

			socket.on("userCountUpdated", async (count) => {
				setOnlineUsers(count.activeUsers)
			})

			socket.on("newestOrdersUpdated", async () => {
				await fetchNewestOrders()
			})
		}

		// Cleanup function
		return () => {
			if (socket) {
				socket.off("orderUpdated")
				socket.off("userCountUpdated")
				socket.off("newestOrdersUpdated")
				socket.disconnect()
				socket = null // Ensure no duplicate connections are created
			}
		}
	}, [])

	// Prepare data for the product distribution pie chart
	const productLabels = productDistributionData.map((item) => item._id)
	const productData = productDistributionData.map((item) => item.count)

	console.log(newestOrders)

	return (
		<div>
			{loadingCount ? (
				<p>Loading Order Count Data...</p>
			) : (
				<OrdersChart
					datasets={[
						{
							label: "Number of Orders",
							color: "rgb(75, 192, 192)",
							data: orderCountData,
						},
					]}
					chartTitle="Orders Per Month (Last 12 Months)"
					chartType="line"
				/>
			)}

			{loadingSum ? (
				<p>Loading Order Sum Data...</p>
			) : (
				<OrdersChart
					datasets={[
						{
							label: "Total Order Value",
							color: "rgb(255, 99, 132)",
							data: orderSumData,
						},
					]}
					chartTitle="Total Order Value Per Month (Last 12 Months)"
					chartType="bar"
				/>
			)}

			<h2>Online Users: {onlineUsers}</h2>
			<h2>Total Page Visits: {totalPageVisits}</h2>

			{loadingDistribution ? (
				<p>Loading Product Distribution...</p>
			) : (
				<OrdersChart
					datasets={[
						{
							label: "Product Distribution",
							color: [
								"rgb(255, 99, 132)",
								"rgb(54, 162, 235)",
								"rgb(255, 205, 86)",
								"rgb(75, 192, 192)",
								"rgb(153, 102, 255)",
								"rgb(201, 203, 207)",
							],
							data: productData, // Use distribution data for pie chart
						},
					]}
					labels={productLabels} // Set category labels for the pie chart
					chartTitle="Product Distribution"
					chartType="pie" // Pie chart type
				/>
			)}
			<div className="p-4">
				<h2 className="text-2xl font-bold mb-4">Newest Orders</h2>
				<div className="space-y-4">
					{newestOrders.map((order, index) => (
						<div
							key={order._id}
							// className="p-4 bg-white shadow-lg rounded-lg transition-transform transform duration-500 ease-in-out opacity-0 animate-fade-in-up"
						>
							<div className="flex justify-between items-center">
								<div className="flex items-center space-x-4">
									<CustomImage
										src={order.products[0].product.thumbnail}
										alt={order.products[0].product.title}
										width={120}
										height={120}
										className="object-cover rounded"
									/>
									<div>
										<h3 className="text-lg font-semibold">
											{order.products[0].product.title} -{" "}
										</h3>
										<p className="text-sm text-gray-500">
											Ordered by: {order.orderBy.firstName}{" "}
											{order.orderBy.lastName}
										</p>
									</div>
								</div>
								<p className="text-lg font-semibold text-blue-500">
									{formatPrice(order.total)}
								</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	)
}
