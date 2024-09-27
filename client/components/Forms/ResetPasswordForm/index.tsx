"use client"
import { FC, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Link from "next/link"
import { passwordHashingClient, path } from "@/utils"
import { Button, InputField } from "@/components"
import { URL } from "@/constant"

type ResetPasswordFormData = {
	password: string
	confirmPassword: string
}

interface ResetPasswordFormProps {
	token: string
}

const ResetPasswordForm: FC<ResetPasswordFormProps> = ({ token }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
	} = useForm<ResetPasswordFormData>()

	const [errorMessage, setErrorMessage] = useState("")
	const [showPassword, setShowPassword] = useState(false)
	const [confirm, setConfirm] = useState(false)

	const handleResetPassword: SubmitHandler<ResetPasswordFormData> = async (
		data
	) => {
		try {
			const { password, confirmPassword } = data

			if (password !== confirmPassword) {
				setErrorMessage("Passwords do not match")
				setConfirm(false)
				return
			}
			const hashPassword = await passwordHashingClient(confirmPassword)
			// const response = await resetPassword(hashPassword, token)
			const response = await fetch(URL + "/api/user/reset-password", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ password: hashPassword, token }),
			})
			const resetPasswordResponse = await response.json()
			if (!resetPasswordResponse.success) {
				const responseErrorMessage =
					resetPasswordResponse.message ||
					"An error occurred while resetting the password"
				setErrorMessage(responseErrorMessage)
				setConfirm(false)
			} else {
				setErrorMessage("")
				setConfirm(true)
			}
		} catch (error) {
			setErrorMessage(
				"An error occurred while resetting the password due to server"
			)
			setConfirm(false)
		}
	}

	return confirm ? (
		<div className="flex flex-col justify-center items-center">
			<p>
				Successfully resetting your password, you can now try to login again
			</p>
			<Link href={path.LOGIN}>
				<Button className="hover-effect border-2 border-rose-500 hover:bg-rose-500 hover:text-white rounded p-1">
					Login
				</Button>
			</Link>
		</div>
	) : (
		<form
			className="flex flex-col justify-center items-center"
			onSubmit={handleSubmit(handleResetPassword)}
		>
			<div>
				<InputField
					label="Password"
					name="password"
					type={showPassword ? "text" : "password"}
					register={register}
					required="Password is required"
					errorMessage={errors.password && "Please enter a valid password."}
				/>

				<InputField
					label="Confirm Password"
					name="confirmPassword"
					type={showPassword ? "text" : "password"}
					register={register}
					required="Confirm password is required"
					validate={(value) => value === watch("password")}
					errorMessage={errors.confirmPassword && "Passwords do not match."}
				/>
			</div>

			{errorMessage ? (
				<div>
					<p className="text-main text-center hover-effect">{errorMessage}</p>
					<Link href={path.FORGOT_PASSWORD}>
						<Button className="border-2 border-rose-500 hover:bg-rose-500 hover:text-white hover-effect p-1 rounded">
							Try reset your password again
						</Button>
					</Link>
				</div>
			) : (
				<Button
					className="cursor-pointer border-2 border-main hover:bg-main hover-effect rounded p-0.5 px-4 my-4"
					type="submit"
				>
					Submit
				</Button>
			)}
		</form>
	)
}

export default ResetPasswordForm
