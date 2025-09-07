"use client"
import React, { useEffect, useState } from "react"
import { Button, Pagination, UserOrder } from "@/components"
import { useMounted } from "@/hooks"
import { selectAuthUser } from "@/store/slices/authSlice"
import { ProfileUser } from "@/types"
import { path, UserOrderSkeleton } from "@/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { API, WEB_URL } from "@/constant"

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
	const searchParams = useSearchParams()
	const page = Number(searchParams.get("page") || 1)

	const user: ProfileUser = useSelector(selectAuthUser)
	const [userOrder, setUserOrder] = useState<UserOrderProps | null>(null)
	const [loading, setLoading] = useState(true)
	const [error, setError] = useState<string>("")
	const [totalPages, setTotalPages] = useState(1)
	const limit = 3

	const fetchUserOrder = async (page: number) => {
		try {
			setLoading(true)
			const res = await fetch(`/api/order?page=${page}&limit=${limit}`, {
				method: "GET",
				cache: "no-cache",
				credentials: "include",
			})
			if (!res.ok) throw new Error("Failed to fetch user orders")

			const data = await res.json()
			setUserOrder(data)
			setTotalPages(data.totalPages)
		} catch (err) {
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

	if (!mounted) return null
	if (!user) {
		router.push(`${WEB_URL}/${path.LOGIN}`)
		return null
	}
	if (loading) {
		return <UserOrderSkeleton />
	}
	if (error) {
		return <div>Error: {error}</div>
	}
	return (
		<div className="mx-auto w-full">
			<UserOrder user={user} userOrder={userOrder} />
			{userOrder && userOrder.data.length > 0 && (
				<div className="text-center gap-2">
					<Pagination totalPages={totalPages} showPageInput={true} />
				</div>
			)}
		</div>
	)
}

export default OrderComponent
