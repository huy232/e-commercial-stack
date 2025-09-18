"use client"
import {
	loginSuccess,
	logout,
	selectAuthUser,
	selectIsAuthenticated,
	selectIsUserLoading,
} from "@/store/slices/authSlice"
import { checkAuthentication, handleGetUserCart } from "@/store/actions/"
import { useEffect, useCallback, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AiOutlineLoading } from "@/assets/icons"
import Link from "next/link"
import { path } from "@/utils"
import { useDropdown } from "@/hooks"
import { Button, CustomImage } from "@/components"
import { AppDispatch, NotifyProps, ProfileUser } from "@/types"
import defaultAvatar from "@/assets/images/defaultAvatar.png"
import clsx from "clsx"
import { API } from "@/constant"
import { notificationLogout } from "@/store/slices/notifySlice"

interface UserProps {
	user: ProfileUser
}

const User = ({ user }: UserProps) => {
	const { isOpen, toggleDropdown } = useDropdown()
	const dispatch = useDispatch<AppDispatch>()

	const itemClass = clsx(
		`hover-effect hover:opacity-80 hover:bg-black/20 p-1 m-1 rounded w-full`
	)

	const requestLogout = async () => {
		try {
			const response = await fetch(`/api/user/logout`, {
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
		await dispatch(handleGetUserCart())
		await dispatch(notificationLogout())
	}, [dispatch])

	return (
		<div className="px-4 relative" data-popover-target="menu">
			{user ? (
				<div
					className="flex gap-2 items-center cursor-pointer hover-effect hover:opacity-80 select-none"
					onClick={toggleDropdown}
				>
					<div className="relative">
						<CustomImage
							src={user?.avatar || defaultAvatar}
							alt="User's avatar"
							className="rounded"
							width={40}
							height={40}
						/>
					</div>
					<span className="hidden lg:block">{user.firstName}</span>
				</div>
			) : (
				<Link className="hover-effect hover:opacity-80" href={path.LOGIN}>
					Login
				</Link>
			)}

			{user && isOpen && (
				<ul
					className={clsx(
						"absolute z-10 min-w-[160px] duration-300 transition-all",
						user && isOpen
							? "min-h-[100px] p-1.5 opacity-100 mt-1 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-heavy focus:outline-none top-[44px] left-[-100px] lg:left-[-60px] xl:left-[-30px]"
							: "h-0 opacity-0"
					)}
					role="menu"
					data-popover="menu"
					data-popover-placement="bottom"
				>
					<li
						role="menuitem"
						className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md px-1 pt-0.5 transition-all hover:bg-slate-100"
					>
						<Link className={itemClass} href={"/profile"}>
							Profile
						</Link>
					</li>
					{user.role.includes("admin") && (
						<li
							role="menuitem"
							className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md px-1 pt-0.5 transition-all hover:bg-slate-100"
						>
							<Link className={itemClass} href={"/admin"}>
								Admin
							</Link>
						</li>
					)}
					<li
						role="menuitem"
						className="cursor-pointer text-slate-800 flex w-full text-sm items-center rounded-md px-1 pt-0.5 transition-all hover:bg-slate-100"
					>
						<Button
							className={clsx(itemClass, "text-left")}
							onClick={handleLogout}
							loading={false}
							aria-label="Logout from your account"
							role="button"
							tabIndex={0}
							data-testid="logout-button"
							id="logout-button"
						>
							Logout
						</Button>
					</li>
				</ul>
			)}
		</div>
	)
}

export default User
