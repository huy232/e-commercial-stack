import { LoginForm } from "@/components"
import { path } from "@/utils"
import Link from "next/link"

export default async function Login() {
	return (
		<section className="flex flex-col items-center justify-center h-full">
			<h2 className="text-center font-bold uppercase">
				Log in to your account
			</h2>
			<LoginForm />
			<div className="flex flex-col text-center">
				<span>
					Don&apos;t have an account?{" "}
					<Link
						className="text-blue-700 font-semibold hover:opacity-70 duration-200 ease-in-out"
						href={path.REGISTER}
					>
						Sign Up
					</Link>
				</span>
				<span className="italic text-gray-500">OR</span>
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
