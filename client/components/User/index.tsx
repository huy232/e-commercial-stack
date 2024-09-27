"use client"
import {
	loginSuccess,
	logout,
	selectAuthUser,
	selectIsAuthenticated,
} from "@/store/slices/authSlice"
import { checkAuthentication } from "@/store/actions/"
import { useEffect, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AiOutlineLoading } from "@/assets/icons"
import Link from "next/link"
import { path } from "@/utils"
import { useDropdown } from "@/hooks"
import { Button, CustomImage } from "@/components"
import { AppDispatch } from "@/types"
import defaultAvatar from "@/assets/images/defaultAvatar.png"
import clsx from "clsx"
import { API } from "@/constant"

const User = () => {
	const [loading, setLoading] = useState(true)
	const { isOpen, toggleDropdown } = useDropdown()
	const dispatch = useDispatch<AppDispatch>()
	const user = useSelector(selectAuthUser)
	const isAuthenticated = useSelector(selectIsAuthenticated)

	const requestLogout = async () => {
		try {
			const response = await fetch(API + `/user/logout`, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			})

			const responseData = await response.json()
			return responseData
		} catch (error) {
			throw error
		}
	}

	const handleLogout = useCallback(async () => {
		await requestLogout()
		await dispatch(logout())
	}, [dispatch])

	useEffect(() => {
		const fetchData = async () => {
			try {
				const response = await dispatch(checkAuthentication())
				if (response.payload) {
					const response = await fetch(`${API}/user/current`, {
						method: "GET",
						credentials: "include",
					})
					const userCheck = await response.json()
					const userData = userCheck.data
					dispatch(loginSuccess(userData))
				} else if (!response.payload) {
					dispatch(logout())
				}
			} catch (error) {
				dispatch(logout())
			} finally {
				setLoading(false)
			}
		}

		if (loading) {
			fetchData()
		}
	}, [dispatch, user, loading])

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
		<div className="flex items-center justify-center gap-2 px-6 relative">
			{user ? (
				<div
					className="flex gap-2 items-center cursor-pointer hover-effect hover:opacity-80 select-none"
					onClick={toggleDropdown}
				>
					<CustomImage
						src={user?.avatar || defaultAvatar}
						alt="User's avatar"
						className="rounded"
						width={40}
						height={40}
					/>

					<span>{user.firstName}</span>
				</div>
			) : (
				<Link className="hover-effect hover:opacity-80" href={path.LOGIN}>
					Login
				</Link>
			)}

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
