"use client"

import { useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { Button, InputField } from "@/components"
import { WEB_URL } from "@/constant"

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
			const response = await fetch(`/api/user/forgot-password`, {
				method: "POST",
				body: JSON.stringify({ email }),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			})
			const forgotPasswordResponse = await response.json()

			if (!forgotPasswordResponse.success) {
				const responseErrorMessage =
					forgotPasswordResponse.message ||
					"An error occurred while resetting password"
				setErrorMessage(responseErrorMessage)
				setConfirm(false)
			} else {
				setErrorMessage("")
				setConfirm(true)
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
					required="Email is required"
					pattern={/^\S+@\S+$/i}
					errorMessage={errors.email && "Please enter a valid email address."}
				/>
			</div>

			{errorMessage && (
				<p className="text-main text-center hover-effect">{errorMessage}</p>
			)}

			<Button
				className="cursor-pointer border-2 border-main hover:bg-main hover-effect rounded p-0.5 px-4 my-4"
				type="submit"
				aria-label="Submit Forgot Password"
				role="button"
				tabIndex={0}
				data-testid="submit-forgot-password-button"
				id="submit-forgot-password-button"
			>
				Submit
			</Button>
		</form>
	)
}

export default ForgotPasswordForm
