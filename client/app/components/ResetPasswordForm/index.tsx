"use client"
import { useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { resetPassword } from "@/app/api"

type ResetPasswordFormData = {
	password: string
	confirmPassword: string
}

const ResetPasswordForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<ResetPasswordFormData>()

	const [errorMessage, setErrorMessage] = useState("")
	const [showPassword, setShowPassword] = useState(false)

	const handleResetPassword: SubmitHandler<ResetPasswordFormData> = async (
		data
	) => {
		try {
			const { password, confirmPassword } = data

			if (password !== confirmPassword) {
				setErrorMessage("Passwords do not match")
				return
			}

			const response = await resetPassword(password)

			if (!response.success) {
				const responseErrorMessage =
					response.message || "An error occurred while resetting the password"
				setErrorMessage(responseErrorMessage)
			} else {
				setErrorMessage("")
				console.log("Password reset successful: ", response)
				// Optionally, you can redirect the user or perform other actions on success
			}
		} catch (error) {
			setErrorMessage(
				"An error occurred while resetting the password due to server"
			)
		}
	}

	return (
		<form
			className="flex flex-col justify-center items-center"
			onSubmit={handleSubmit(handleResetPassword)}
		>
			<div>
				<div className="flex flex-col gap-2 py-2">
					<label className="text-md font-medium">Password</label>
					<div className="relative">
						<input
							className="rounded p-1"
							type={showPassword ? "text" : "password"}
							{...register("password", { required: true })}
							placeholder="Password"
						/>
						<button
							className="absolute right-0 top-0 mt-2 mr-2"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? "Hide" : "Show"}
						</button>
					</div>
					{errors.password && (
						<p className="text-main duration-300 ease-out">
							Please enter a valid password.
						</p>
					)}
				</div>
				<div className="flex flex-col gap-2 py-2">
					<label className="text-md font-medium">Confirm Password</label>
					<input
						className="rounded p-1"
						type="password"
						{...register("confirmPassword", {
							required: true,
							validate: (value) => value === watch("password"),
						})}
						placeholder="Confirm Password"
					/>
					{errors.confirmPassword && (
						<p className="text-main duration-300 ease-out">
							Passwords do not match.
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
				Submit
			</button>
		</form>
	)
}

export default ResetPasswordForm
