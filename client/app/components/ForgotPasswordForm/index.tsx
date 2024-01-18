"use client"

import { forgotPassword } from "@/app/api"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"

const ForgotPasswordForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const [errorMessage, setErrorMessage] = useState("")

	const handleForgotPassword = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			try {
				await handleSubmit(async (data) => {
					const { email } = data
					const response = await forgotPassword(email)

					if (!response.success) {
						const responseErrorMessage =
							response.message || "An error occured while resetting password"
						setErrorMessage(responseErrorMessage)
					} else {
						setErrorMessage("")
						console.log("Print this handle login success: ", response)
					}
				})(event)
			} catch (error) {
				setErrorMessage(
					"An error occured while resetting password due to server"
				)
			}
		},
		[handleSubmit]
	)

	return (
		<form
			className="flex flex-col justify-center items-center"
			onSubmit={handleForgotPassword}
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
export default ForgotPasswordForm
