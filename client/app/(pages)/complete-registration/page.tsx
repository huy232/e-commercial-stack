import { verifyAccount } from "@/app/api"
import { VerifyAccount } from "@/app/components"
import Link from "next/link"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CompleteRegistration(props: Props) {
	const token = props.searchParams.token as string | undefined

	if (!token) {
		console.error("Token is undefined")
		return (
			<div className="w-main">
				<div className="flex flex-col gap-2 items-center">
					<span className="text-rose-500 italic">
						Something went wrong, please goes back and try sign up again.
					</span>
					<span>Please try sign up again.</span>
					<Link
						className="border-2 border-rose-500 p-1 rounded hover:bg-rose-500 hover:text-white hover-effect"
						href={"/register"}
					>
						Sign up
					</Link>
				</div>
			</div>
		)
	}

	const response = await verifyAccount(token)
	if (!response.success) {
		return (
			<div className="w-main">
				<div className="flex flex-col gap-2 items-center">
					<span className="text-rose-500 italic">
						Something went wrong, please goes back and try sign up again.
					</span>
					<span>Please try sign up again.</span>
					<Link
						className="border-2 border-rose-500 p-1 rounded hover:bg-rose-500 hover:text-white hover-effect"
						href={"/register"}
					>
						Sign up
					</Link>
				</div>
			</div>
		)
	}
	return (
		<div className="w-main">
			<div className="flex flex-col gap-2 items-center">
				<span className="text-teal-500 italic">
					Successfully verifying your account
				</span>
				<span>Your account has verified, you can proceed to shopping now.</span>
				<Link
					className="border-2 border-teal-500 p-1 rounded hover:bg-teal-500 hover:text-white hover-effect"
					href={"/"}
				>
					Home page
				</Link>
			</div>
		</div>
	)
}
