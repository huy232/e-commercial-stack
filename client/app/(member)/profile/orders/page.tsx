"use client"
import { Button, UserOrder } from "@/components"
import { useMounted } from "@/hooks"
import { selectAuthUser } from "@/store/slices/authSlice"
import { ProfileUser } from "@/types"
import { path } from "@/utils"
import { useRouter } from "next/navigation"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { API } from "@/constant"
import clsx from "clsx"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

interface UserOrderProps {
	currentPage: number
	data: []
	hasNextPage: boolean
	success: boolean
	totalItems: number
	totalPages: number
}

const UserOrderPage = (props: Props) => {
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
			<div>
				<UserOrder user={user} userOrder={userOrder} />
				{!!userOrder && !!userOrder.data.length && (
					<div className="text-center gap-2">
						<Button
							onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
							disabled={page === 1}
							className={clsx(
								"rounded p-1 hover-effect border-2",
								page === 1
									? "cursor-not-allowed bg-gray-500"
									: "border-red-500 hover:bg-red-500"
							)}
						>
							Previous
						</Button>
						<span className="text-xs">
							{page}/{totalPages}
						</span>
						<Button
							onClick={() => setPage((prev) => prev + 1)}
							disabled={!hasNextPage}
							className={clsx(
								"rounded p-1 hover-effect border-2",
								!hasNextPage
									? "cursor-not-allowed bg-gray-500"
									: "border-red-500 hover:bg-red-500"
							)}
						>
							Next
						</Button>
					</div>
				)}
			</div>
		)
	}
}

export default UserOrderPage
