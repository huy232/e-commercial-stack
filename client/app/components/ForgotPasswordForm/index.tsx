"use client"

import { forgotPassword } from "@/app/api"
import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { InputField } from "@/app/components"

const ForgotPasswordForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const [errorMessage, setErrorMessage] = useState("")
	const [confirm, setConfirm] = useState(false)

	const handleForgotPassword = useCallback(async (data: any) => {
		try {
			const { email } = data
			const response = await forgotPassword(email)

			if (!response.success) {
				const responseErrorMessage =
					response.message || "An error occurred while resetting password"
				setErrorMessage(responseErrorMessage)
				setConfirm(false)
			} else {
				setErrorMessage("")
				setConfirm(true)
				console.log("Print this handle login success: ", response)
			}
		} catch (error) {
			setErrorMessage(
				"An error occurred while resetting password due to server"
			)
			setConfirm(false)
		}
	}, [])

	return confirm ? (
		<div className="flex flex-col justify-center items-center">
			<p className="text-teal-500">
				Please check your mailbox for resetting password information.
			</p>
		</div>
	) : (
		<form
			className="flex flex-col justify-center items-center"
			onSubmit={handleSubmit(handleForgotPassword)}
		>
			<div>
				<InputField
					label="Email"
					name="email"
					register={register}
					required
					pattern={/^\S+@\S+$/i}
					errorMessage={errors.email && "Please enter a valid email address."}
				/>
			</div>

			{errorMessage && (
				<p className="text-main text-center hover-effect">{errorMessage}</p>
			)}

			<button
				className="cursor-pointer border-2 border-main hover:bg-main hover-effect rounded p-0.5 px-4 my-4"
				type="submit"
			>
				Submit
			</button>
		</form>
	)
}

export default ForgotPasswordForm
