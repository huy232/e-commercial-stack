"use client"

import React, { useEffect, useState } from "react"
import { CustomImage, OrdersChart, Skeleton } from "@/components"
import { API, BASE_SERVER_URL } from "@/constant"
import io, { Socket } from "socket.io-client"
import { OrderType } from "@/types"
import { formatPrice } from "@/utils"
import { FaCartArrowDown, LuPackageCheck } from "@/assets/icons"
import { motion } from "framer-motion"

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
	const [newestOrders, setNewestOrders] = useState<OrderType[] | []>([])
	const [ordersCategory, setOrdersCategory] = useState<
		{ _id: string; title: string; totalSold: number }[]
	>([])
	const [allYearOrders, setAllYearOrders] = useState()

	const [loadingCount, setLoadingCount] = useState(true)
	const [loadingSum, setLoadingSum] = useState(true)
	const [loadingDistribution, setLoadingDistribution] = useState(true)
	const [loadingNewestOrders, setLoadingNewestOrders] = useState(true)

	// Fetch order count by month
	const fetchOrderCountByMonth = async () => {
		try {
			const response = await fetch(`/api/order/monthly`, {
				method: "GET",
				credentials: "include",
				cache: "no-cache",
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
			const response = await fetch(`/api/order/monthly-price`, {
				method: "GET",
				credentials: "include",
				cache: "no-cache",
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
			const response = await fetch(`/api/product/product-distribution`, {
				method: "GET",
				credentials: "include",
				cache: "no-cache",
			})
			const result = await response.json()
			setProductDistributionData(result)
		} catch (error) {
			console.error("Error fetching product distribution:", error)
		} finally {
			setLoadingDistribution(false)
		}
	}

	const fetchNewestOrders = async () => {
		try {
			setLoadingNewestOrders(true)
			const response = await fetch(`/api/order/newest-order`, {
				method: "GET",
				credentials: "include",
				cache: "no-cache",
			})
			const result = await response.json()
			setNewestOrders(result.data)
		} catch (error) {
			console.error("Error fetching newest orders: ", error)
		} finally {
			setLoadingNewestOrders(false)
		}
	}

	const fetchOrdersCategory = async () => {
		try {
			const response = await fetch(`/api/order/orders-category`, {
				method: "GET",
				credentials: "include",
				cache: "no-cache",
			})
			const result = await response.json()
			setOrdersCategory(result.data)
		} catch (error) {
			console.error("Error fetching orders category: ", error)
		}
	}

	const fetchAllYearSaleOrders = async () => {
		try {
			const response = await fetch(`/api/order/all-year-orders`, {
				method: "GET",
				credentials: "include",
				cache: "no-cache",
			})
			const result = await response.json()
			setAllYearOrders(result.data)
		} catch (error) {
			console.error("Error fetching all year sale orders: ", error)
		}
	}

	// Set up real-time updates
	useEffect(() => {
		fetchOrderCountByMonth()
		fetchOrderSumByMonth()
		fetchProductDistribution()
		fetchNewestOrders()
		fetchOrdersCategory()
		fetchAllYearSaleOrders()

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
				socket = null
			}
		}
	}, [])

	// Prepare data for the product distribution pie chart
	const productLabels = productDistributionData.map((item) => item._id)
	const productData = productDistributionData.map((item) => item.count)

	return (
		<div className="w-full">
			<h2 className="text-3xl uppercase text-right font-bebasNeue font-bold mr-4">
				Admin dashboard
			</h2>

			<div className="grid grid-cols-1 md:grid-cols-3 mx-4 gap-4">
				{/* Orders Chart */}
				<div className="flex flex-col">
					{loadingCount ? (
						<Skeleton className="w-full h-[300px]" />
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
						<Skeleton className="w-full h-[300px] mt-4" />
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
				</div>

				{/* Product Distribution */}
				<div>
					{loadingDistribution ? (
						<>
							<Skeleton className="w-full h-[300px]" />
							<Skeleton className="w-1/2 h-6 mx-auto mt-4" />
							<div className="grid grid-cols-3 gap-3 mt-2">
								{Array.from({ length: 6 }).map((_, i) => (
									<Skeleton key={i} className="h-12 w-full" />
								))}
							</div>
						</>
					) : (
						<>
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
										data: productData,
									},
								]}
								labels={productLabels}
								chartTitle="Product Distribution"
								chartType="pie"
							/>
							<h3 className="font-anton text-2xl lg:text-xl font-semibold text-center mt-4">
								Product distribution sold
							</h3>
							<div className="grid grid-cols-3 gap-3 mt-2">
								{ordersCategory.map((categoryOrder, index) => (
									<div
										key={index}
										className="text-center bg-black/50 rounded p-1"
									>
										<span className="font-inter italic text-xs font-semibold uppercase">
											{categoryOrder.title}
										</span>
										<span className="flex items-center gap-2 justify-center">
											<span className="flex flex-row items-center gap-1 mr-2">
												<span className="text-sm">
													{categoryOrder.totalSold}
												</span>
											</span>
										</span>
									</div>
								))}
							</div>
						</>
					)}
				</div>

				{/* Newest Orders */}
				<div className="p-4">
					<h2 className="font-anton text-2xl lg:text-xl font-bold mb-4 uppercase text-center md:text-left">
						Newest Orders
					</h2>
					<div className="space-y-4">
						{loadingNewestOrders
							? Array.from({ length: 4 }).map((_, i) => (
									<div key={i} className="flex items-center space-x-4">
										<Skeleton className="w-[60px] h-[60px]" />
										<div className="flex-1 space-y-2">
											<Skeleton className="w-3/4 h-4" />
											<Skeleton className="w-1/2 h-3" />
										</div>
									</div>
							  ))
							: newestOrders.map((order) => (
									<motion.div
										key={order._id}
										initial={{ opacity: 0, y: 10 }}
										animate={{ opacity: 1, y: 0 }}
										transition={{ duration: 0.5 }}
									>
										<div className="flex flex-col mx-auto">
											<div className="flex flex-row items-center space-x-4">
												<CustomImage
													src={order.products[0].product.thumbnail}
													alt={order.products[0].product.title}
													fill
													className="object-contain rounded w-[120px] h-[120px] md:w-[80px] md:h-[80px] lg:w-[80px] lg:h-[80px] xl:w-[60px] xl:h-[60px]"
												/>
												<h3 className="text-base font-semibold line-clamp-2">
													{order.products[0].product.title}
												</h3>
											</div>
											<div className="flex flex-col">
												<p className="text-base font-semibold text-green-500">
													{formatPrice(order.total)}
												</p>
												<p className="text-xs text-gray-500 inline-flex gap-0.5 italic">
													Ordered by: <span>{order.orderBy.firstName}</span>
													<span>{order.orderBy.lastName}</span>
												</p>
											</div>
										</div>
									</motion.div>
							  ))}
					</div>
				</div>
			</div>
		</div>
	)
}
