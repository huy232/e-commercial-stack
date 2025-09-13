import { Metadata } from "next"
import dynamic from "next/dynamic"

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

const ForgotPasswordForm = dynamic(
	() => import("@/components/Forms/ForgotPasswordForm"),
	{ ssr: false }
)

export default function ForgotPassword() {
	return <ForgotPasswordForm />
}
