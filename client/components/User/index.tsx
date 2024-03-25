"use client"
import { getCurrentUser, userLogout } from "@/app/api"
import {
	checkAuthentication,
	loginSuccess,
	logout,
	selectAuthUser,
	selectIsAuthenticated,
} from "@/store/slices/authSlice"
import { useEffect, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AiOutlineLoading, FaUserCircle } from "@/assets/icons"
import Link from "next/link"
import { path } from "@/utils"
import { useDropdown } from "@/hooks"
import { Button } from "@/components"
import { AppDispatch } from "@/types"
import clsx from "clsx"

const User = () => {
	const [loading, setLoading] = useState(true)
	const { isOpen, toggleDropdown } = useDropdown()
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector(selectAuthUser)
	const isAuthenticated = useSelector(selectIsAuthenticated)

	const handleLogout = useCallback(async () => {
		await userLogout()
		dispatch(logout())
	}, [dispatch])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await dispatch(checkAuthentication())
				if (response.payload) {
					if (!user) {
						const response = await getCurrentUser()
						const userData = response.data
						dispatch(loginSuccess(userData))
					}
				} else {
					await userLogout()
					dispatch(logout())
				}
			} catch (error) {
				await userLogout()
				dispatch(logout())
			} finally {
				setLoading(false)
			}
		}

		fetchData()
	}, [dispatch, user, isAuthenticated])

	if (loading) {
		return (
			<button
				type="button"
				className="bg-black/20 rounded w-[100px] flex justify-center items-center p-1"
				disabled
			>
				<AiOutlineLoading className="animate-spin h-[20px] w-[20px]" />
			</button>
		)
	}

	const itemClass = clsx(
		`hover-effect hover:opacity-80 hover:bg-black/20 p-1 m-1 rounded`
	)

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
				<div className="absolute h-full w-full mt-1 z-10">
					<div className="bg-black/70 rounded flex flex-col gap-1">
						<Link className={itemClass} href={"/profile"}>
							Profile
						</Link>

						{user.role.includes("admin") && (
							<Link className={itemClass} href={"/admin"}>
								Admin
							</Link>
						)}

						<Button
							className={clsx(itemClass, "text-left")}
							onClick={handleLogout}
						>
							Logout
						</Button>
					</div>
				</div>
			)}
		</div>
	)
}

export default User
