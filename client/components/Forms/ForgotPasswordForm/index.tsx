"use client"

import { useCallback, useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button, InputField } from "@/components"
import { motion, AnimatePresence } from "framer-motion"
import clsx from "clsx"

const ForgotPasswordForm = () => {
	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
	} = useForm()

	const [errorMessage, setErrorMessage] = useState("")
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState(false)

	const handleForgotPassword = useCallback(
		async (data: any) => {
			setLoading(true)
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
					setErrorMessage(
						forgotPasswordResponse.message ||
							"An error occurred while resetting password"
					)
					setSuccess(false)
				} else {
					setErrorMessage("")
					setSuccess(true)
					reset()
				}
			} catch (error) {
				setErrorMessage(
					"An error occurred while resetting password due to server"
				)
				setSuccess(false)
			} finally {
				setLoading(false)
			}
		},
		[reset]
	)

	// Reset button back after 5 seconds
	useEffect(() => {
		if (success) {
			const timer = setTimeout(() => {
				setSuccess(false)
			}, 5000)
			return () => clearTimeout(timer)
		}
	}, [success])

	return (
		<motion.div
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="w-full bg-white shadow-xl rounded-2xl p-4 border border-gray-100 flex flex-col items-center justify-center flex-grow h-full"
		>
			<form
				className="flex flex-col space-y-6"
				onSubmit={handleSubmit(handleForgotPassword)}
			>
				<div className="text-center">
					<h2 className="text-2xl font-semibold font-bebasNeue">
						Forgot <span className="italic">your</span>
						<span className="text-main ml-2">password?</span>
					</h2>
					<p className="text-gray-500 text-sm mt-1">
						Enter your account email and we’ll send you a reset link.
					</p>
				</div>

				<InputField
					label="Email"
					name="email"
					register={register}
					required="Email is required"
					pattern={/^\S+@\S+$/i}
					errorMessage={errors.email && "Please enter a valid email address."}
				/>

				<AnimatePresence>
					{errorMessage && (
						<motion.div
							key="error"
							initial={{ opacity: 0, y: -10 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -10 }}
							transition={{ duration: 0.3 }}
							className="bg-red-50 text-red-600 text-sm p-3 rounded-lg border border-red-200"
						>
							{errorMessage}
						</motion.div>
					)}
				</AnimatePresence>

				<motion.div whileTap={{ scale: success ? 1 : 0.97 }}>
					<motion.button
						type="submit"
						disabled={loading || success}
						className={clsx(
							`w-full py-2 rounded-lg text-white flex items-center justify-center gap-2 shadow-heavy transition-all duration-300 group`,
							success
								? "bg-green-500 hover:bg-green-600"
								: "bg-red-500 hover:bg-opacity-70 hover:scale-105"
						)}
						animate={{ scale: success ? [1, 1.05, 1] : 1 }}
						transition={{ duration: 0.3 }}
					>
						{loading ? (
							<span className="animate-pulse">Sending...</span>
						) : success ? (
							<>
								<span>✓</span> Sent!
							</>
						) : (
							<span className="group-hover:animate-tada">Send Reset Link</span>
						)}
					</motion.button>
				</motion.div>
			</form>
		</motion.div>
	)
}

export default ForgotPasswordForm
