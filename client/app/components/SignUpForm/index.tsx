"use client"

import { useForm } from "react-hook-form"
import { BiShow, BiHide } from "@/assets/icons"
import { useState, useCallback } from "react"
import { UserRegister, userRegister } from "@/app/api"

const SignUpForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const [passwordVisible, setPasswordVisible] = useState(false)

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
		() =>
			handleSubmit(async (data) => {
				const { firstName, lastName, email, password } = data as UserRegister
				const response = await userRegister({
					firstName,
					lastName,
					email,
					password,
				})
			}),
		[handleSubmit]
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
						<p className="text-main duration-300 ease-out">
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
						<p className="text-main duration-300 ease-out">
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
						<p className="text-main duration-300 ease-out">
							Password is required.
						</p>
					)}
				</div>
			</div>
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
