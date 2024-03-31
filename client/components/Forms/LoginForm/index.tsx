"use client"
import { FC, useCallback, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { passwordHashingClient } from "@/utils"
import { UserLogin, userLogin } from "@/app/api"
import { Button, InputField } from "@/components"
import { useRouter } from "next/navigation"
import { loginSuccess } from "@/store/slices/authSlice"
import { useDispatch } from "react-redux"

type LoginFormData = {
	email: string
	password: string
}

const LoginForm: FC = () => {
	const dispatch = useDispatch()
	const router = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors },
		watch,
		getValues,
		setValue,
	} = useForm<LoginFormData>()
	const [errorMessage, setErrorMessage] = useState("")

	const login = useCallback(async (email: string, hashPassword: string) => {
		const response = await userLogin({
			email,
			password: hashPassword,
		})
		return response
	}, [])

	const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
		const { email, password } = data as UserLogin
		const hashPassword = await passwordHashingClient(password)
		try {
			const response = await login(email, hashPassword)

			if (!response.success) {
				const responseErrorMessage =
					response.message || "An error occurred while login"
				setErrorMessage(responseErrorMessage)
			} else {
				dispatch(loginSuccess(response.userData))
				router.push("/")
				router.refresh()
			}
		} catch (error) {
			setErrorMessage("An error occurred while login due to server")
		}
	}
	return (
		<>
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
				/>
				<Button
					className="cursor-pointer border-2 border-main hover:bg-main hover-effect rounded p-0.5 px-4 my-4"
					type="submit"
					form="hook-form"
				>
					Login
				</Button>
				{errorMessage && (
					<p className="text-main text-center hover-effect">{errorMessage}</p>
				)}
			</form>
		</>
	)
}

export default LoginForm
