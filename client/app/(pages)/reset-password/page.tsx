import { ResetPasswordForm } from "@/components"
import { Metadata } from "next"
import Link from "next/link"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
	title: "Reset Password | Digital World",
	description:
		"Securely set a new password for your Digital World account and continue enjoying a safe and personalized shopping experience.",
	keywords: [
		"Digital World reset password",
		"set new password",
		"password update",
		"secure account",
	],
}

export default function ResetPassword(props: Props) {
	const searchParams = props.searchParams
	const token = searchParams.token
	if (!token) {
		return (
			<div className="w-main">
				<div className="flex flex-col gap-2 items-center">
					<span className="text-rose-500 italic">
						Something went wrong, please goes back and try resetting your
						password again.
					</span>
					<span>Try resetting password again.</span>
					<Link
						className="border-2 border-rose-500 p-1 rounded hover:bg-rose-500 hover:text-white hover-effect"
						href={"/forgot-password"}
					>
						Sign up
					</Link>
				</div>
			</div>
		)
	}

	return (
		<section className="flex flex-col items-center justify-center h-full">
			<h2 className="text-2xl font-semibold font-bebasNeue">
				Reset your password
			</h2>
			<ResetPasswordForm token={token as string} />
		</section>
	)
}
