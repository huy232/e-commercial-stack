import { ForgotPasswordForm } from "@/components"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Forgot Your Password | Digital World",
	description:
		"Recover access to your Digital World account. Request a password reset link to regain access to your orders, profile, and personalized shopping experience.",
	keywords: [
		"Digital World password reset",
		"forgot password",
		"account recovery",
		"reset link",
		"recover account",
	],
}

export default function ForgotPassword() {
	return (
		<main className="w-main">
			<h2>Forgot your password?</h2>
			<ForgotPasswordForm />
		</main>
	)
}
