"use client"
import { getCurrentUser, userLogout } from "@/app/api"
import { loginSuccess, logout, selectAuthUser } from "@/store/slices/authSlice"
import { useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaUserCircle } from "@/assets/icons"
import Link from "next/link"
import { path } from "@/utils"
import { useDropdown } from "@/app/hooks"

const User = () => {
	const { isOpen, toggleDropdown } = useDropdown()
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
		<div>
			<div
				className="flex gap-2 items-center cursor-pointer hover-effect hover:opacity-80 select-none"
				onClick={toggleDropdown}
			>
				<FaUserCircle size={24} />
				{user ? (
					<span>{user.firstName}</span>
				) : (
					<Link href={path.LOGIN}>Login</Link>
				)}
			</div>
			{user && isOpen && (
				<div className="absolute h-full w-full bg-black/20 rounded mt-1 z-10">
					<div className="p-1">
						<button onClick={handleLogout}>Logout</button>
					</div>
				</div>
			)}
		</div>
	)
}
export default User
