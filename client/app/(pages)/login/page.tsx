import { path } from "@/utils"
import { Metadata } from "next"
import dynamic from "next/dynamic"
import Link from "next/link"

export const metadata: Metadata = {
	title: "Log In | Digital World",
	description:
		"Access your Digital World account to track orders, manage your profile, and enjoy a personalized shopping experience. Secure and easy login for returning customers.",
	keywords: [
		"Digital World login",
		"customer login",
		"user account access",
		"sign in",
		"track orders",
		"manage account",
	],
}

const GoogleAuth = dynamic(() => import("@/components/GoogleAuth"), {
	ssr: false,
})

const LoginForm = dynamic(() => import("@/components/Forms/LoginForm"), {
	ssr: false,
})

export default async function Login() {
	return (
		<section className="flex items-center justify-center">
			<div className="w-full max-w-md bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-4 flex flex-col gap-2 transition-transform duration-300 my-4">
				{/* Heading */}
				<h2 className="text-center text-2xl font-extrabold tracking-wide uppercase text-gray-800 font-bebasNeue">
					<span className="text-red-500">Log in</span> to your account
				</h2>

				{/* Form */}
				<LoginForm />

				{/* Divider */}
				<div className="flex items-center gap-2">
					<div className="flex-1 border-t border-gray-300"></div>
					<span className="text-gray-500 text-sm">OR</span>
					<div className="flex-1 border-t border-gray-300"></div>
				</div>

				{/* Google Auth */}
				<GoogleAuth />

				{/* Footer */}
				<div className="relative w-full mt-6">
					{/* gradient line */}
					<div className="absolute -top-4 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-pink-400 to-purple-500 rounded-full"></div>

					<div className="bg-white shadow-lg rounded-xl p-2 text-center flex flex-col gap-3 border border-gray-300">
						<span className="text-sm text-gray-700">
							Don&apos;t have an account?{" "}
							<Link
								className="text-red-400 font-semibold hover:underline hover:text-red-800 duration-300"
								href={path.REGISTER}
							>
								Sign Up
							</Link>
						</span>

						<div className="flex items-center justify-center gap-2">
							<div className="flex-1 border-t border-gray-300"></div>
							<span className="text-xs text-gray-400">OR</span>
							<div className="flex-1 border-t border-gray-300"></div>
						</div>

						<Link
							className="text-sm font-medium text-blue-400 hover:text-blue-800 hover:underline duration-300"
							href={path.FORGOT_PASSWORD}
						>
							Forgot your password?
						</Link>
					</div>
				</div>
			</div>
		</section>
	)
}
