import { SignUpForm } from "@/components"

export default function SignUp() {
	return (
		<section className="flex flex-col items-center justify-center h-full">
			<h2 className="text-center font-bold uppercase">Creating your account</h2>
			<SignUpForm />
		</section>
	)
}
