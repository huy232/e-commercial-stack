"use client"
import { FC, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { LoadingSpinner, passwordHashingClient } from "@/utils"
import { Button, InputField } from "@/components"
import { useRouter } from "next/navigation"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch } from "@/types"
import { handleUserLogin } from "@/store/actions"
import { CiLogin } from "@/assets/icons"
import { selectAuthUser } from "@/store/slices/authSlice"
import { AnimatePresence, motion } from "framer-motion"

type LoginFormData = {
	email: string
	password: string
}

const LoginForm: FC = () => {
	const user = useSelector(selectAuthUser)
	const dispatch = useDispatch<AppDispatch>()
	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<LoginFormData>()
	const [errorMessage, setErrorMessage] = useState("")
	const [loading, setLoading] = useState(false)

	const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
		if (loading) return // prevent double-submit
		setLoading(true)

		const { email, password } = data
		const hashPassword = await passwordHashingClient(password)

		try {
			await dispatch(
				handleUserLogin({ email, password: hashPassword })
			).unwrap()

			router.push("/") // success
		} catch (error: any) {
			setErrorMessage(error || "An error occurred while login")
		} finally {
			setLoading(false)
		}
	}

	return (
		<form id="hook-form" onSubmit={handleSubmit(handleLogin)}>
			<motion.div
				className="w-full max-w-sm mx-auto bg-white/90 backdrop-blur rounded-xl shadow-lg p-4 flex flex-col gap-4"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ duration: 0.4, ease: "easeOut" }}
			>
				<motion.h2
					className="text-2xl font-bold text-center text-main mb-4 font-bebasNeue"
					initial={{ opacity: 0, y: -20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5, ease: "easeOut" }}
				>
					Welcome Back
				</motion.h2>

				<InputField
					label="Email"
					name="email"
					type="text"
					register={register}
					required="Email is required"
					errorMessage={errors.email?.message}
					pattern={/^\S+@\S+$/i}
					disabled={user || loading}
				/>

				<InputField
					label="Password"
					name="password"
					type="password"
					minLength={6}
					register={register}
					required="Password is required"
					togglePassword
					errorMessage={errors.password?.message}
					disabled={user || loading}
				/>

				<motion.div whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}>
					<Button
						className="w-full cursor-pointer bg-main hover:bg-main-dark text-white rounded-lg py-2 px-4 mt-2 flex items-center justify-center gap-2 transition-colors"
						type="submit"
						form="hook-form"
						disabled={user || loading}
						loading={user || loading}
						aria-label="Login"
					>
						{loading ? (
							<>
								<LoadingSpinner />
								<span>Logging in</span>
							</>
						) : (
							<>
								<span>Login</span>
								<CiLogin className="mt-1" />
							</>
						)}
					</Button>
				</motion.div>

				<AnimatePresence>
					{errorMessage && (
						<motion.p
							key="error"
							className="bg-red-100 border border-red-300 text-red-600 text-center px-3 py-2 rounded-md"
							initial={{ opacity: 0, x: -20 }}
							animate={{ opacity: 1, x: 0 }}
							exit={{ opacity: 0, x: 20 }}
							transition={{ duration: 0.3 }}
						>
							{errorMessage}
						</motion.p>
					)}
				</AnimatePresence>
			</motion.div>
		</form>
	)
}

export default LoginForm
