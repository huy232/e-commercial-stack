import { CompleteRegistrationClient } from "@/components"
import { WEB_URL } from "@/constant"
import { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
	title: "Complete Registration | Digital World",
	description:
		"Finish setting up your Digital World account to unlock exclusive deals, track orders, and enjoy a fully personalized shopping experience.",
	keywords: [
		"Digital World complete registration",
		"account setup",
		"finish sign up",
		"exclusive deals",
		"track orders",
	],
}

type Props = {
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function CompleteRegistration({ searchParams }: Props) {
	const token = searchParams.token as string | undefined

	if (!token) {
		return <ErrorBox message="Something went wrong, invalid token." />
	}

	const response = await fetch(WEB_URL + `/api/user/complete-registration`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		cache: "no-cache",
		body: JSON.stringify({ token }),
	})

	const verifyResponse = await response.json()

	if (!verifyResponse.success) {
		return (
			<ErrorBox
				message={
					verifyResponse.message || "Something went wrong during verification."
				}
			/>
		)
	}

	return <CompleteRegistrationClient />
}

function ErrorBox({ message }: { message: string }) {
	return (
		<div className="w-full xl:w-main mx-auto flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
			<div className="bg-rose-50 border border-rose-300 rounded-xl p-8 text-center shadow-lg">
				<span className="text-rose-600 font-semibold text-lg block mb-2">
					{message}
				</span>
				<span className="text-rose-400 mb-4 block">
					Please try signing up again.
				</span>
				<Link
					className="inline-block mt-2 px-6 py-2 border-2 border-rose-500 rounded-full font-medium text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300"
					href="/register"
				>
					Sign Up
				</Link>
			</div>
		</div>
	)
}
