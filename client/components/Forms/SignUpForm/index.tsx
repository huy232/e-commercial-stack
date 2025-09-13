"use client"

import { useForm } from "react-hook-form"
import { useState, useEffect } from "react"
import { passwordHashingClient, path } from "@/utils"
import { Button, InputField } from "@/components"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

type ErrorMessage = {
	location: string
	msg: string
	path: string
	type: string
}

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		watch,
		formState: { errors, isValid },
		setValue,
	} = useForm({ mode: "onChange" })

	const [errorMessage, setErrorMessage] = useState<string>("")
	const [errorsField, setErrorsField] = useState<[] | undefined>([])
	const [showSignUpComplete, setShowSignUpComplete] = useState(false)

	// Track password live
	const password = watch("password", "")

	// Password conditions
	const passwordChecks = [
		{
			label: "At least 8 characters",
			isValid: password.length >= 8,
		},
		{
			label: "One uppercase letter",
			isValid: /[A-Z]/.test(password),
		},
		{
			label: "One lowercase letter",
			isValid: /[a-z]/.test(password),
		},
		{
			label: "One number",
			isValid: /\d/.test(password),
		},
		{
			label: "One special character",
			isValid: /[^A-Za-z0-9]/.test(password),
		},
	]

	const handleRegister = handleSubmit(async (data) => {
		const { firstName, lastName, email, password } = data
		const hashPassword = await passwordHashingClient(password)

		const registerResponse = await fetch(`/api/user/register`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				firstName,
				lastName,
				email,
				password: hashPassword,
			}),
			cache: "no-cache",
		})
		const response = await registerResponse.json()
		if (response.success) {
			setShowSignUpComplete(true)
		} else {
			setErrorsField(response.errors || [])
			setErrorMessage(response.message || "An error occurred during sign up.")
		}
	})

	return showSignUpComplete ? (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="p-6 text-center bg-green-100 rounded-xl shadow-md my-4"
		>
			<h2 className="text-2xl font-semibold text-green-800">
				🎉 Sign-up Complete!
			</h2>
			<p className="mt-2 text-green-700">
				Please check your email to verify your account.
			</p>
		</motion.div>
	) : (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="w-full max-w-md mx-auto bg-white shadow-lg rounded-2xl p-6 my-4"
		>
			<form className="flex flex-col gap-4" onSubmit={handleRegister}>
				<InputField
					label="First name"
					name="firstName"
					register={register}
					required
					errorMessage={
						errors.firstName?.message?.toString() ||
						(errors.firstName && "Please enter your first name.")
					}
					validateType="onlyWords"
					setValue={setValue}
				/>
				<InputField
					label="Last name"
					name="lastName"
					register={register}
					required
					errorMessage={
						errors.lastName?.message?.toString() ||
						(errors.lastName && "Please enter your last name.")
					}
					validateType="onlyWords"
					setValue={setValue}
				/>
				<InputField
					label="Email"
					name="email"
					register={register}
					required
					validateType="email"
					errorMessage={
						errors.email?.message?.toString() ||
						(errors.email && "Please enter a valid email address.")
					}
					setValue={setValue}
				/>
				<div>
					<InputField
						label="Password"
						name="password"
						type="password"
						register={register}
						required
						togglePassword
						errorMessage={
							errors.password?.message?.toString() ||
							(errors.password && "Password is required")
						}
						validateType="custom"
						setValue={setValue}
					/>

					{/* Password checklist */}
					<div className="mt-3 space-y-1 text-sm">
						{passwordChecks.map((check, idx) => (
							<motion.div
								key={idx}
								initial={{ opacity: 0, x: -10 }}
								animate={{ opacity: 1, x: 0 }}
								className={`flex items-center gap-2 ${
									check.isValid ? "text-green-600" : "text-gray-500"
								}`}
							>
								<span
									className={`inline-block w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
										check.isValid
											? "bg-green-500 border-green-500 text-white"
											: "border-gray-400"
									}`}
								>
									{check.isValid && "✔"}
								</span>
								{check.label}
							</motion.div>
						))}
					</div>
				</div>

				{errorMessage && (
					<motion.p
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						className="text-red-600 text-sm text-center"
					>
						{errorMessage}
					</motion.p>
				)}
				{errorsField?.map((errorMessage: ErrorMessage, index: number) => (
					<p key={index} className="text-red-500 text-sm text-center">
						{errorMessage.msg}
					</p>
				))}

				<Button
					className={`rounded-xl py-3 mt-4 transition-all font-semibold shadow-md ${
						isValid
							? "bg-blue-600 text-white hover:bg-blue-700"
							: "bg-gray-300 text-gray-500 cursor-not-allowed"
					}`}
					type="submit"
					disabled={!isValid}
				>
					Sign up
				</Button>
			</form>

			<div className="mt-4 text-center">
				<span className="text-gray-600">
					Already have an account?{" "}
					<Link
						className="text-blue-600 font-semibold hover:underline"
						href={path.LOGIN}
					>
						Log in
					</Link>
				</span>
			</div>
		</motion.div>
	)
}
export default SignUpForm
