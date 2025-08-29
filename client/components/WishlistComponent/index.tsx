"use client"
import React from "react"
import { Button, Pagination, UserWishlist } from "@/components"
import { useMounted } from "@/hooks"
import { selectAuthUser } from "@/store/slices/authSlice"
import { ProfileUser } from "@/types"
import { path } from "@/utils"
import { useRouter, useSearchParams } from "next/navigation"
import { useSelector } from "react-redux"
import { useEffect, useState } from "react"
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

	useEffect(() => {
		if (mounted && !user) router.push(`${WEB_URL}/${path.LOGIN}`)
	}, [mounted, user, router])

	useEffect(() => {
		if (!mounted || !user) return
		const page = Number(searchParams.get("page") ?? 1)
		fetchUserWishlist(page)
	}, [mounted, user, searchParams])

	if (!mounted || loading || !wishlistData) return <div>Loading...</div>

	const { wishlist, totalPages } = wishlistData

	return (
		<div className="w-full">
			<UserWishlist user={user} userWishlist={wishlist} />

			<Pagination totalPages={totalPages} showPageInput />
		</div>
	)
}

export default WishlistComponent
