import { SignUpForm } from "@/app/components"
import { path } from "@/utils"
import Link from "next/link"

export default function SignUp() {
	return (
		<section className="flex flex-col items-center justify-center h-full">
			<h2 className="text-center font-bold uppercase">Creating your account</h2>
			<SignUpForm />
			<div className="flex flex-col text-center">
				<span>
					Back to{" "}
					<Link
						className="text-blue-700 font-semibold hover:opacity-70 duration-200 ease-in-out"
						href={path.LOGIN}
					>
						Login
					</Link>
				</span>
			</div>
		</section>
	)
}
