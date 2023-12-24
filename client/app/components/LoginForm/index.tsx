"use client"

import { useForm } from "react-hook-form"
import { BiShow, BiHide } from "@/assets/icons"
import { useState } from "react"

const LoginForm = () => {
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

	return (
		<div>
			<h2 className="text-center font-bold uppercase">Login</h2>
			<form
				className="flex flex-col justify-center items-center"
				onSubmit={handleSubmit((data) => console.log(data))}
			>
				<div>
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
					className="cursor-pointer border-2 border-main hover:bg-main duration-300 ease-linear rounded p-2 my-4"
					type="submit"
				>
					Login
				</button>
			</form>
		</div>
	)
}
export default LoginForm
