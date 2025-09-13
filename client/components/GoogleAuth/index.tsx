"use client"
import { FcGoogle } from "@/assets/icons"
import { loginSuccess, selectAuthUser } from "@/store/slices/authSlice"
import { AppDispatch } from "@/types"
import { useGoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-toastify"
import { Button } from "@/components"
import { useState } from "react"
import { motion } from "framer-motion"

const GoogleAuth = () => {
	const user = useSelector(selectAuthUser)
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleGoogleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				setLoading(true)
				const userInfoRes = await fetch(
					`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
				)
				const userInfo = await userInfoRes.json()
				if (!userInfo.sub) throw new Error("Invalid Google response")

				const res = await fetch("/api/auth/google-login", {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					credentials: "include",
					body: JSON.stringify({
						googleId: userInfo.sub,
						email: userInfo.email,
						firstName: userInfo.given_name,
						lastName: userInfo.family_name,
					}),
				})

				const data = await res.json()
				if (data.success) {
					dispatch(loginSuccess(data.user))
					toast.success("Login successful!")
					router.push("/")
				} else {
					toast.error("Login failed: " + data.message)
				}
			} catch (error) {
				console.error("Google Login Error:", error)
				toast.error("Google Login Failed")
			} finally {
				setLoading(false)
			}
		},
		onError: () => {
			toast.error("Google Login Failed")
			setLoading(false)
		},
	})

	const isDisabled = !!user || loading

	return (
		<motion.div
			whileTap={{ scale: 0.95 }}
			whileHover={{ scale: isDisabled ? 1 : 1.05 }}
			className="w-full flex justify-center"
		>
			<Button
				onClick={() => !isDisabled && handleGoogleLogin()}
				className={`group flex items-center gap-2 px-4 py-2 border-red-500 border-2 rounded-md duration-300 ease-in-out ${
					isDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-red-600"
				}`}
				aria-label="Login with Google"
				role="button"
				disabled={isDisabled}
			>
				{loading ? (
					<span className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
				) : (
					<FcGoogle size={22} />
				)}
				<span
					className={`${
						isDisabled ? "text-gray-500" : "text-black group-hover:text-white"
					}`}
				>
					{user ? "Already Logged In" : "Login with "}
					{!user && (
						<span className="group-hover:font-bold group-hover:italic">
							Google
						</span>
					)}
				</span>
			</Button>
		</motion.div>
	)
}

export default GoogleAuth
