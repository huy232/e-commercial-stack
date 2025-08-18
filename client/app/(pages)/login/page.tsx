import { GoogleAuth, LoginForm } from "@/components"
import { path } from "@/utils"
import { Metadata } from "next"
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

export default async function Login() {
	return (
		<section className="flex flex-col items-center justify-center h-full">
			<h2 className="text-center font-bold uppercase mb-2">
				<span className="text-red-500">Log in</span> to your account
			</h2>
			<LoginForm />
			<div className="flex items-center w-[320px] my-2">
				<div className="flex-1 border-t-2 border-gray-300"></div>
				<span className="px-2 text-gray-500 text-sm">OR</span>
				<div className="flex-1 border-t-2 border-gray-300"></div>
			</div>
			<GoogleAuth />
			<div className="flex flex-col text-center my-2 bg-red-500/20 p-2 rounded-lg">
				<span className="flex gap-1">
					<span>Don&apos;t have an account?</span>
					<Link
						className="text-blue-700 font-semibold hover:opacity-70 duration-200 ease-in-out"
						href={path.REGISTER}
					>
						Sign Up
					</Link>
				</span>
				<span className="italic text-gray-500 text-xs">OR</span>
				<Link
					className="text-blue-700 font-semibold hover:opacity-70 duration-200 ease-in-out"
					href={path.FORGOT_PASSWORD}
				>
					Forgot your password?
				</Link>
			</div>
		</section>
	)
}
