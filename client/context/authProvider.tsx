"use client"

import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
	loginSuccess,
	logout,
	selectIsAuthenticated,
	selectAuthUser,
} from "@/store/slices/authSlice"
import {
	checkAuthentication,
	getUserWishlist,
	fetchNotifications,
} from "@/store/actions"
import { AppDispatch } from "@/types"
import { API, BASE_SERVER_URL } from "@/constant"
import { addNewNotification } from "@/store/slices/notifySlice"
import io, { Socket } from "socket.io-client"

export default function AuthProvider({
	children,
}: {
	children: React.ReactNode
}) {
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector(selectAuthUser)
	const isAuthenticated = useSelector(selectIsAuthenticated)
	const [localLoading, setLocalLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			try {
				const authRes = await dispatch(checkAuthentication())
				if (authRes.payload) {
					const userRes = await fetch(`/api/user/current`, {
						method: "GET",
						credentials: "include",
					})
					const userData = (await userRes.json()).data
					dispatch(loginSuccess(userData))
				} else {
					dispatch(logout())
				}
			} catch {
				dispatch(logout())
			} finally {
				setLocalLoading(false)
			}
		}
		fetchData()
	}, [dispatch])

	useEffect(() => {
		if (!user?._id) return

		dispatch(getUserWishlist())
		dispatch(fetchNotifications({ page: 1, type: "all" }))
	}, [user?._id, dispatch])

	useEffect(() => {
		if (!isAuthenticated || !user?._id) return

		let socket: Socket | null = null

		import("socket.io-client").then(({ io }) => {
			socket = io(BASE_SERVER_URL, { withCredentials: true })

			socket.on("connect", () => {
				socket?.emit("registerUser", user._id)
				console.log(`User ${user._id} registered with socket ${socket?.id}`)
			})

			socket.on("newNotification", async (notification) => {
				await dispatch(addNewNotification(notification))
			})
		})

		return () => {
			if (socket) {
				socket.off("newNotification")
				socket.disconnect()
				socket = null
			}
		}
	}, [user?._id, isAuthenticated, dispatch])

	if (localLoading) return null

	return children
}
