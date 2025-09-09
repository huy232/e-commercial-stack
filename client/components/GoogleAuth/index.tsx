"use client"
import { FcGoogle } from "@/assets/icons"
import { loginSuccess } from "@/store/slices/authSlice"
import { AppDispatch } from "@/types"
import { useGoogleLogin } from "@react-oauth/google"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { toast } from "react-toastify"
import { Button } from "@/components"

const GoogleAuth = () => {
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const handleGoogleLogin = useGoogleLogin({
		onSuccess: async (tokenResponse) => {
			try {
				const userInfoRes = await fetch(
					`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${tokenResponse.access_token}`
				)
				const userInfo = await userInfoRes.json()

				if (!userInfo.sub) throw new Error("Invalid Google response")

				// Send Google user data to backend for verification & JWT generation
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
					// Dispatch to Redux
					dispatch(loginSuccess(data.user))
					toast.success("Login successful!")
					// Redirect to home page
					router.push("/")
				} else {
					toast.error("Login failed: " + data.message)
				}
			} catch (error) {
				console.error("Google Login Error:", error)
				toast.error("Google Login Failed")
			}
		},
		onError: () => toast.error("Google Login Failed"),
	})

	return (
		<Button
			onClick={() => handleGoogleLogin()}
			className="group flex items-center gap-1 px-4 py-2 border-red-500 border-2 rounded-md hover:bg-red-600 duration-300 ease-in-out"
			aria-label="Login with Google"
			role="button"
			tabIndex={0}
			data-testid="google-login-button"
			id="google-login-button"
		>
			<FcGoogle size={24} />
			<span className="text-black group-hover:text-white">
				Login with{" "}
				<span className="group-hover:font-bold group-hover:italic">Google</span>
			</span>
		</Button>
	)
}

export default GoogleAuth
