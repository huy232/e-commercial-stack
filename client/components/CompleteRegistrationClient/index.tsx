"use client"

import { useAppDispatch } from "@/store"
import { loginSuccess } from "@/store/slices/authSlice"
import { useEffect } from "react"

export default function CompleteRegistrationClient() {
	const dispatch = useAppDispatch()

	useEffect(() => {
		const autoLogin = async () => {
			try {
				const currentUserResponse = await fetch(`/api/user/current`, {
					method: "GET",
					credentials: "include",
					headers: { "Content-Type": "application/json" },
					cache: "no-cache",
				})

				const currentUser = await currentUserResponse.json()
				if (currentUser.success) {
					dispatch(loginSuccess(currentUser.data))
				}
			} catch (err) {
				console.error("Auto-login failed:", err)
			}
		}

		autoLogin()
	}, [dispatch])

	return (
		<div className="w-full xl:w-main mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
			<div className="bg-teal-50 border border-teal-300 rounded-xl p-8 text-center shadow-lg transform hover:scale-[1.02] transition-transform duration-300">
				<span className="text-teal-600 font-semibold text-lg block mb-2">
					Account Verified!
				</span>
				<span className="text-teal-400 mb-4 block">
					Your account has been successfully verified. Start shopping now!
				</span>
			</div>
		</div>
	)
}
