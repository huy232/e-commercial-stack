"use client"
import { FC, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { passwordHashingClient } from "@/utils"
import { UserLogin, userLogin, userLogout } from "@/app/api"
import { InputField } from "@/app/components" // Import the InputField component
import { useRouter } from "next/navigation"
import { loginSuccess } from "@/store/slices/authSlice"
import { useDispatch } from "react-redux"

const LoginForm: FC = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const [errorMessage, setErrorMessage] = useState("")

	const login = useCallback(async (email: string, hashPassword: string) => {
		const response = await userLogin({
			email,
			password: hashPassword,
		})
		return response
	}, [])

	const handleLogin = useCallback(
		async (data: any) => {
			const { email, password } = data as UserLogin
			const hashPassword = await passwordHashingClient(password)

			try {
				const response = await login(email, hashPassword)

				if (!response.success) {
					const responseErrorMessage =
						response.message || "An error occurred while login"
					setErrorMessage(responseErrorMessage)
				} else {
					console.log("Print this handle login success: ", response)
					dispatch(loginSuccess(response.userData))
					router.push("/")
					router.refresh()
				}
			} catch (error) {
				setErrorMessage("An error occurred while login due to server")
			}
		},
		[dispatch, login, router]
	)

	return (
		<form
			className="flex flex-col justify-center items-center"
			onSubmit={handleSubmit(handleLogin)}
		>
			<div>
				<InputField
					label="Email"
					name="email"
					register={register}
					required
					validateType="email"
					errorMessage={
						errors.email &&
						(errors.email.message?.toString() ||
							"Please enter a valid email address.")
					}
				/>

				<InputField
					label="Password"
					name="password"
					type="password"
					register={register}
					required
					togglePassword
					errorMessage={
						errors.password &&
						(errors.password.message?.toString() || "Password is required")
					}
					minLength={6}
					validateType="password"
				/>
			</div>

			{errorMessage && (
				<p className="text-main text-center hover-effect">{errorMessage}</p>
			)}

			<button
				className="cursor-pointer border-2 border-main hover:bg-main hover-effect rounded p-0.5 px-4 my-4"
				type="submit"
			>
				Login
			</button>
		</form>
	)
}

export default LoginForm
