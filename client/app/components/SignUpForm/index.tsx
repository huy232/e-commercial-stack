"use client"

import { useForm } from "react-hook-form"
import { BiShow, BiHide } from "@/assets/icons"
import { useState, useCallback } from "react"
import { UserRegister, userRegister } from "@/app/api"
import axios from "axios"
import { passwordHashingClient } from "@/utils"
import { useRouter } from "next/navigation"

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const router = useRouter()
	const [passwordVisible, setPasswordVisible] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	const togglePasswordVisibility = () => {
		const passwordInput = document.getElementById(
			"password"
		) as HTMLInputElement

		if (passwordInput) {
			passwordInput.type = passwordVisible ? "password" : "text"
			setPasswordVisible(!passwordVisible)
		}
	}

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
					router.push("/")
				})(event)
			} catch (err: unknown) {
				if (axios.isAxiosError(err)) {
					setErrorMessage(err.response?.data?.message || "An error occurred")
				} else {
					setErrorMessage("An error occured")
				}
			}
		},
		[handleSubmit, router]
	)

	return (
		<form
			className="flex flex-col justify-center items-center"
			onSubmit={handleRegister}
		>
			<div>
				<div className="flex flex-col gap-2 py-2">
					<label className="text-md font-medium">First name</label>
					<input
						className="rounded p-1"
						{...register("firstName", { required: true })}
						placeholder="First name"
					/>
					<label className="text-md font-medium">Last name</label>
					<input
						className="rounded p-1"
						{...register("lastName", { required: true })}
						placeholder="Last name"
					/>
					{(errors.firstName || errors.lastName) && (
						<p className="text-main duration-300 ease-in-out">
							Please enter your name.
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2 py-2">
					<label className="text-md font-medium">Email</label>
					<input
						className="rounded p-1"
						{...register("email", { required: true, pattern: /^\S+@\S+$/i })}
						placeholder="Email"
					/>
					{errors.email && (
						<p className="text-main duration-300 ease-in-out">
							Please enter a valid email address.
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2 py-2">
					<label className="text-md font-medium">Password</label>
					<div className="flex items-center justify-center gap-4">
						<input
							className="rounded p-1"
							id="password"
							type={passwordVisible ? "text" : "password"}
							{...register("password", { required: true })}
							placeholder="Password"
						/>
						<button
							className="duration-300 ease-in-out"
							type="button"
							onClick={togglePasswordVisibility}
						>
							{passwordVisible ? <BiHide /> : <BiShow />}
						</button>
					</div>
					{errors.password && (
						<p className="text-main duration-300 ease-in-out">
							Password is required.
						</p>
					)}
				</div>
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
	)
}
export default SignUpForm
