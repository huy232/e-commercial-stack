"use client"
import React from "react"
import { Button, Pagination, UserOrder } from "@/components"
import { useMounted } from "@/hooks"
import { selectAuthUser } from "@/store/slices/authSlice"
import { ProfileUser } from "@/types"
import { path } from "@/utils"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { API } from "@/constant"
import clsx from "clsx"
interface UserOrderProps {
	currentPage: number
	data: []
	hasNextPage: boolean
	success: boolean
	totalItems: number
	totalPages: number
}
const OrderComponent = () => {
	const router = useRouter()
	const mounted = useMounted()
	const user: ProfileUser = useSelector(selectAuthUser)
	const [userOrder, setUserOrder] = useState<UserOrderProps | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>("")
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState(1)
	const [hasNextPage, setHasNextPage] = useState(false)
	const limit = 3
	const fetchUserOrder = async (page: number) => {
		try {
			setLoading(true)
			const userOrderResponse = await fetch(
				`${API}/order?page=${page}&limit=${limit}`,
				{
					method: "GET",
					cache: "no-cache",
					credentials: "include",
				}
			)
			if (!userOrderResponse.ok) {
				throw new Error("Failed to fetch user orders")
			}
			const data = await userOrderResponse.json()
			setUserOrder(data)
			setHasNextPage(data.hasNextPage)
			setTotalPages(data.totalPages)
		} catch (error) {
			setError("Something went wrong while fetching")
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (mounted && user) {
			fetchUserOrder(page)
		}
	}, [mounted, user, page])

	if (loading && !mounted) {
		return null
	}

	if (!loading && mounted && !user) {
		router.push(`${URL}${path.LOGIN}`)
	}

	if (error) {
		return <div>Error: {error}</div>
	}
	if (!loading && mounted && user) {
		return (
			<div className="mx-auto w-full">
				<UserOrder user={user} userOrder={userOrder} />
				{!!userOrder && !!userOrder.data.length && (
					<div className="text-center gap-2">
						<Pagination totalPages={totalPages} showPageInput={true} />
					</div>
				)}
			</div>
		)
	}
}

export default OrderComponent
