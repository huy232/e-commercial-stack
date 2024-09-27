"use client"
import { FC, useCallback, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { passwordHashingClient } from "@/utils"
import { Button, InputField } from "@/components"
import { useRouter } from "next/navigation"
import { loginSuccess } from "@/store/slices/authSlice"
import { useDispatch } from "react-redux"
import { API, URL } from "@/constant"
import { AppDispatch } from "@/types"

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
	const login = useCallback(async (email: string, hashPassword: string) => {
		const loginResponse = await fetch(API + "/user/login", {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				email,
				password: hashPassword,
			}),
		})

		const response = await loginResponse.json()
		return response
	}, [])

	const handleLogin: SubmitHandler<LoginFormData> = async (data) => {
		const { email, password } = data
		const hashPassword = await passwordHashingClient(password)
		try {
			const response = await login(email, hashPassword)
			if (!response.success) {
				const responseErrorMessage =
					response.message || "An error occurred while login"
				setErrorMessage(responseErrorMessage)
			} else {
				await dispatch(loginSuccess(response.userData))
				router.push("/")
				// router.refresh()
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
					pattern={/^\S+@\S+$/i}
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
