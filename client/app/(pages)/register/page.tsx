import { SignUpForm } from "@/components"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Register | Digital World",
	description:
		"Create your Digital World account today to enjoy exclusive offers, track your orders, and experience faster checkout. Sign up in just a few steps.",
	keywords: [
		"Digital World register",
		"create account",
		"sign up",
		"new customer",
		"join Digital World",
		"exclusive offers",
	],
}

export default function SignUp() {
	return (
		<section className="flex flex-col items-center justify-center h-full">
			<h2 className="text-center font-bold uppercase">Creating your account</h2>
			<SignUpForm />
		</section>
	)
}
