"use client"
import { FC, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { LoadingSpinner, passwordHashingClient } from "@/utils"
import { Button, InputField } from "@/components"
import { useRouter } from "next/navigation"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/types"
import { handleUserLogin } from "@/store/actions"
import { CiLogin } from "@/assets/icons"

type LoginFormData = {
	email: string
	password: string
}

const LoginForm: FC = () => {
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
			const response = await dispatch(
				handleUserLogin({ email, password: hashPassword })
			)
			if (!response.payload.success) {
				const responseErrorMessage =
					response.message || "An error occurred while login"
				setErrorMessage(responseErrorMessage)
			} else {
				router.push("/")
			}
		} catch (error) {
			setErrorMessage("An error occurred while login due to server")
		} finally {
			setLoading(false)
		}
	}

	return (
		<form
			id="hook-form"
			className="flex flex-col justify-center items-center"
			onSubmit={handleSubmit(handleLogin)}
		>
			<InputField
				label="Email"
				name="email"
				type="text"
				register={register}
				required={"Email is required"}
				errorMessage={errors.email?.message}
				pattern={/^\S+@\S+$/i}
				disabled={loading}
			/>
			<InputField
				label="Password"
				name="password"
				type="password"
				minLength={6}
				register={register}
				required={"Password is required"}
				togglePassword
				errorMessage={errors.password?.message}
				disabled={loading}
			/>
			<Button
				className="cursor-pointer border-2 border-main hover:bg-main hover-effect rounded py-1 px-4 mt-4 group hover:text-white flex items-center justify-center gap-0.5"
				type="submit"
				form="hook-form"
				disabled={loading}
				loading={loading}
			>
				{loading ? (
					<div className="flex items-center gap-2">
						<LoadingSpinner />
						<span>Logging in</span>
					</div>
				) : (
					<div className="flex items-center gap-2">
						<span>Login</span>
						<CiLogin className="mt-1" />
					</div>
				)}
			</Button>
			{errorMessage && (
				<p className="text-main text-center hover-effect">{errorMessage}</p>
			)}
		</form>
	)
}

export default LoginForm
