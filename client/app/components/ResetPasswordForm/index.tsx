"use client"
import { FC, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { resetPassword } from "@/app/api"
import { BiHide, BiShow } from "@/assets/icons"
import Link from "next/link"
import { passwordHashingClient, path } from "@/utils"

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
			const response = await resetPassword(hashPassword, token)

			if (!response.success) {
				const responseErrorMessage =
					response.message || "An error occurred while resetting the password"
				setErrorMessage(responseErrorMessage)
				setConfirm(false)
			} else {
				setErrorMessage("")
				console.log("Password reset successful: ", response)
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
				<button className="duration-300 ease-linear border-2 border-rose-500 hover:bg-rose-500 hover:text-white rounded p-1">
					Login
				</button>
			</Link>
		</div>
	) : (
		<form
			className="flex flex-col justify-center items-center"
			onSubmit={handleSubmit(handleResetPassword)}
		>
			<div>
				<div className="flex flex-col gap-2 py-2">
					<label className="text-md font-medium">Password</label>
					<div className="flex items-center justify-center gap-4">
						<input
							className="rounded p-1"
							type={showPassword ? "text" : "password"}
							{...register("password", { required: true })}
							placeholder="Password"
						/>
						<button
							className="duration-300 ease-in-out"
							type="button"
							onClick={() => setShowPassword(!showPassword)}
						>
							{showPassword ? <BiHide /> : <BiShow />}
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
						type={showPassword ? "text" : "password"}
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
			{errorMessage ? (
				<div>
					<p className="text-main text-center duration-300 ease-in-out">
						{errorMessage}
					</p>
					<Link href={path.FORGOT_PASSWORD}>
						<button className="border-2 border-rose-500 hover:bg-rose-500 hover:text-white duration-300 ease-in-out p-1 rounded">
							Try reset your password again
						</button>
					</Link>
				</div>
			) : (
				<button
					className="cursor-pointer border-2 border-main hover:bg-main duration-300 ease-linear rounded p-0.5 px-4 my-4"
					type="submit"
				>
					Submit
				</button>
			)}
		</form>
	)
}

export default ResetPasswordForm
