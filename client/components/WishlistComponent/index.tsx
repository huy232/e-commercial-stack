"use client"
import React, { useEffect, useState } from "react"
import { Pagination, UserWishlist } from "@/components"
import { useMounted } from "@/hooks"
import { selectAuthUser } from "@/store/slices/authSlice"
import { ProfileUser } from "@/types"
import { LoadingSpinner, path } from "@/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { API, WEB_URL } from "@/constant"

const WishlistComponent = () => {
	const LIMIT = 6
	const mounted = useMounted()
	const router = useRouter()
	const searchParams = useSearchParams()
	const user: ProfileUser = useSelector(selectAuthUser)

	const [loading, setLoading] = useState(true)
	const [wishlistData, setWishlistData] = useState<{
		wishlist: any[]
		totalPages: number
		currentPage: number
		hasNextPage: boolean
	} | null>(null)

	const fetchUserWishlist = async (page: number) => {
		try {
			setLoading(true)
			const res = await fetch(
				`/api/wishlist/user?page=${page}&limit=${LIMIT}`,
				{
					method: "GET",
					cache: "no-cache",
					credentials: "include",
				}
			)

			if (!res.ok) throw new Error("Failed to fetch user wishlist")

			const data = await res.json()
			setWishlistData({
				wishlist: data.wishlist,
				totalPages: data.totalPages,
				currentPage: data.currentPage,
				hasNextPage: data.hasNextPage,
			})
		} catch (error) {
			setWishlistData(null)
		} finally {
			setLoading(false)
		}
	}

	// redirect if not logged in
	useEffect(() => {
		if (mounted && !user) {
			router.push(`${WEB_URL}/${path.LOGIN}`)
		}
	}, [mounted, user, router])

	// fetch wishlist
	useEffect(() => {
		if (!mounted || !user) return
		const page = Number(searchParams.get("page") ?? 1)
		fetchUserWishlist(page)
	}, [mounted, user, searchParams])

	if (!mounted) return null

	if (loading) return <LoadingSpinner />

	if (!wishlistData) {
		return <div className="text-center text-gray-500">No wishlist found.</div>
	}

	const { wishlist, totalPages } = wishlistData

	return (
		<div className="w-full flex flex-col h-full justify-between">
			<UserWishlist user={user} userWishlist={wishlist} />
			<Pagination totalPages={totalPages} showPageInput />
		</div>
	)
}

export default WishlistComponent
