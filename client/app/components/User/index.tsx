"use client"
import { getCurrentUser, userLogout } from "@/app/api"
import { loginSuccess, logout, selectAuthUser } from "@/store/slices/authSlice"
import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaUserCircle } from "@/assets/icons"
import Link from "next/link"
import { path } from "@/utils"

const User = () => {
	const dispatch = useDispatch()
	const user = useSelector(selectAuthUser)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				if (!user) {
					const response = await getCurrentUser()
					const userData = response.data
					dispatch(loginSuccess(userData))
				}
			} catch (error) {
				await userLogout()
				dispatch(logout())
			}
		}

		fetchUser()
	}, [dispatch, user])

	const handleLogout = useCallback(async () => {
		await userLogout()
		dispatch(logout())
	}, [dispatch])

	return (
		<div className="relative">
			<div className="flex gap-2 items-center">
				<FaUserCircle size={24} />
				{user ? (
					<span>{user.firstName}</span>
				) : (
					<Link href={path.LOGIN}>Login</Link>
				)}
			</div>
			{user && (
				<div className="absolute h-[300px] w-full bg-rose-500">
					<button onClick={handleLogout}>Logout</button>
				</div>
			)}
		</div>
	)
}
export default User
