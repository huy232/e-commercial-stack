"use client"

import { useForm } from "react-hook-form"
import { useState, useCallback } from "react"
import { UserRegister, userRegister } from "@/app/api"
import axios from "axios"
import { passwordHashingClient, path } from "@/utils"
import { InputField, SignUpComplete } from "@/app/components"
import Link from "next/link"

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const [errorMessage, setErrorMessage] = useState("")
	const [showSignUpComplete, setShowSignUpComplete] = useState(false)

	const handleRegister = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			try {
				await handleSubmit(async (data) => {
					const { firstName, lastName, email, password } = data as UserRegister
					const hashPassword = await passwordHashingClient(password)
					await userRegister({
						firstName,
						lastName,
						email,
						password: hashPassword,
					})
					setShowSignUpComplete(true)
				})(event)
			} catch (err: unknown) {
				if (axios.isAxiosError(err)) {
					setErrorMessage(err.response?.data?.message || "An error occurred")
				} else {
					setErrorMessage("An error occured")
				}
			}
		},
		[handleSubmit]
	)

	return showSignUpComplete ? (
		<SignUpComplete />
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
							(errors.firstName || errors.lastName) && "Please enter your name."
						}
					/>
					<InputField
						label="Last name"
						name="lastName"
						register={register}
						required
					/>
					<InputField
						label="Email"
						name="email"
						register={register}
						required
						pattern={/^\S+@\S+$/i}
						errorMessage={errors.email && "Please enter a valid email address."}
					/>
					<InputField
						label="Password"
						name="password"
						type="password"
						register={register}
						required
						togglePassword
						errorMessage={errors.password && "Password is required."}
					/>
				</div>
				{errorMessage && (
					<p className="text-main text-center duration-300 ease-in-out">
						{errorMessage}
					</p>
				)}
				<button
					className="cursor-pointer border-2 border-main hover:bg-main duration-300 ease-linear rounded p-0.5 px-4 my-4"
					type="submit"
				>
					Sign up
				</button>
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
