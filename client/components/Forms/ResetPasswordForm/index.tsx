"use client"

import { FC, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import Link from "next/link"
import { passwordHashingClient, path } from "@/utils"
import { Button, InputField } from "@/components"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"

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
	const [confirm, setConfirm] = useState(false)
	const [buttonState, setButtonState] = useState<
		"idle" | "loading" | "success"
	>("idle")

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

			setButtonState("loading")
			const hashPassword = await passwordHashingClient(confirmPassword)
			const response = await fetch(`/api/user/reset-password`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ password: hashPassword, token }),
			})
			const resetPasswordResponse = await response.json()

			if (!resetPasswordResponse.success) {
				setErrorMessage(
					resetPasswordResponse.message ||
						"An error occurred while resetting the password"
				)
				setConfirm(false)
				setButtonState("idle")
			} else {
				setErrorMessage("")
				setConfirm(true)
				setButtonState("success")
				setTimeout(() => setButtonState("idle"), 5000)
			}
		} catch (error) {
			setErrorMessage(
				"An error occurred while resetting the password due to server"
			)
			setConfirm(false)
			setButtonState("idle")
		}
	}

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="w-full max-w-md bg-white shadow-xl rounded-2xl p-4 border border-gray-100"
		>
			<AnimatePresence mode="wait">
				{confirm ? (
					<motion.div
						key="success"
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -30 }}
						transition={{ duration: 0.4 }}
						className="flex flex-col items-center text-center space-y-4"
					>
						<motion.div
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ type: "spring", stiffness: 300, damping: 15 }}
							className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 text-green-600"
						>
							✓
						</motion.div>
						<motion.p
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							transition={{ delay: 0.2 }}
							className="text-green-600 font-medium"
						>
							Successfully reset your password! You can now login.
						</motion.p>
						<Link href={path.LOGIN}>
							<Button className="hover-effect border-2 border-green-500 hover:bg-green-500 hover:text-white rounded p-1">
								Login
							</Button>
						</Link>
					</motion.div>
				) : (
					<motion.form
						key="form"
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -20 }}
						transition={{ duration: 0.4 }}
						className="flex flex-col space-y-6"
						onSubmit={handleSubmit(handleResetPassword)}
					>
						<div className="text-center">
							<p className="text-gray-500 text-sm mt-1">
								Enter a new password and confirm it to update your account.
							</p>
						</div>

						<InputField
							label="Password"
							name="password"
							type="password"
							register={register}
							required="Password is required"
							errorMessage={errors.password && "Please enter a valid password."}
						/>

						<InputField
							label="Confirm Password"
							name="confirmPassword"
							type="password"
							register={register}
							required="Confirm password is required"
							validate={(value) => value === watch("password")}
							errorMessage={errors.confirmPassword && "Passwords do not match."}
						/>

						<AnimatePresence>
							{errorMessage && (
								<motion.div
									key="error"
									initial={{ opacity: 0, y: -10 }}
									animate={{ opacity: 1, y: 0 }}
									exit={{ opacity: 0, y: -10 }}
									transition={{ duration: 0.3 }}
									className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200 text-center"
								>
									{errorMessage}
								</motion.div>
							)}
						</AnimatePresence>

						<motion.div whileTap={{ scale: 0.97 }}>
							<Button
								type="submit"
								disabled={
									buttonState === "loading" || buttonState === "success"
								}
								loading={buttonState === "loading"}
								className={clsx(
									`w-full py-2 rounded-lg shadow-md hover:shadow-heavy transition-all hover:opacity-70 duration-500`,
									buttonState === "success"
										? "bg-green-500 text-white"
										: "bg-main text-white hover:bg-main-dark"
								)}
							>
								{buttonState === "success" ? "✓ Password Reset" : "Submit"}
							</Button>
						</motion.div>
					</motion.form>
				)}
			</AnimatePresence>
		</motion.div>
	)
}

export default ResetPasswordForm
