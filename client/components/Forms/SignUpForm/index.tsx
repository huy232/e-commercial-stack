"use client"

import { useForm } from "react-hook-form"
import { useState, useCallback } from "react"
import { passwordHashingClient, path } from "@/utils"
import { Button, InputField } from "@/components"
import Link from "next/link"
import { API, URL } from "@/constant"

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
		formState: { errors },
	} = useForm()
	const [errorMessage, setErrorMessage] = useState<string>("")
	const [errorsField, setErrorsField] = useState<[] | undefined>([])
	const [showSignUpComplete, setShowSignUpComplete] = useState(false)

	const handleRegister = handleSubmit(async (data) => {
		const { firstName, lastName, email, password } = data
		const hashPassword = await passwordHashingClient(password)

		const registerResponse = await fetch(API + "/user/register", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				password: hashPassword,
			}),
			cache: "no-cache",
		})
		const response = await registerResponse.json()
		if (response.success) {
			setShowSignUpComplete(true)
		} else {
			setErrorsField(response.errors || [])
		}
	})

	return showSignUpComplete ? (
		<div>
			Your sign-up is completed, please check your email to verify your account.
		</div>
	) : (
		<>
			<form
				className="flex flex-col justify-center items-center"
				onSubmit={handleRegister}
			>
				<div>
					<InputField
						label="First name"
						name="firstName"
						register={register}
						required
						errorMessage={
							errors.firstName &&
							(errors.firstName.message?.toString() ||
								"Please enter your first name.")
						}
						validateType="onlyWords"
					/>
					<InputField
						label="Last name"
						name="lastName"
						register={register}
						required
						errorMessage={
							errors.lastName &&
							(errors.lastName.message?.toString() ||
								"Please enter your last name.")
						}
						validateType="onlyWords"
					/>
					<InputField
						label="Email"
						name="email"
						register={register}
						required
						validateType="email"
						errorMessage={
							errors.email &&
							(errors.email.message?.toString() ||
								"Please enter a valid email address.")
						}
					/>
					<InputField
						label="Password"
						name="password"
						type="password"
						register={register}
						required
						togglePassword
						errorMessage={
							errors.password &&
							(errors.password.message?.toString() || "Password is required")
						}
						minLength={6}
						validateType="custom"
					/>
				</div>
				{errorMessage && (
					<p className="text-main text-center hover-effect">{errorMessage}</p>
				)}
				{errorsField &&
					errorsField.map((errorMessage: ErrorMessage, index: number) => (
						<p key={index} className="text-main text-center">
							{errorMessage.msg}
						</p>
					))}
				<Button
					className="cursor-pointer border-2 border-main hover:bg-main hover-effect rounded p-0.5 px-4 my-4"
					type="submit"
				>
					Sign up
				</Button>
			</form>
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
		</>
	)
}
export default SignUpForm
