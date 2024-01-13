"use client"
import { useForm } from "react-hook-form"
import { BiShow, BiHide } from "@/assets/icons"
import { FC, useCallback, useEffect, useState } from "react"
import { UserLogin, checkUserLogin, userLogin } from "@/app/api"
import { passwordHashingClient } from "@/utils"
import { useRouter } from "next/navigation"

const LoginForm: FC = () => {
	const router = useRouter()

	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const [passwordVisible, setPasswordVisible] = useState(false)
	const [errorMessage, setErrorMessage] = useState("")

	const togglePasswordVisibility = () => {
		const passwordInput = document.getElementById(
			"password"
		) as HTMLInputElement

		if (passwordInput) {
			passwordInput.type = passwordVisible ? "password" : "text"
			setPasswordVisible(!passwordVisible)
		}
	}

	const login = useCallback(async (email: string, hashPassword: string) => {
		const response = await userLogin({
			email,
			password: hashPassword,
		})
		return response
	}, [])

	const handleLogin = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			try {
				await handleSubmit(async (data) => {
					const { email, password } = data as UserLogin
					const hashPassword = await passwordHashingClient(password)
					const response = await login(email, hashPassword)

					if (!response.success) {
						const responseErrorMessage =
							response.message || "An error occured while login"
						setErrorMessage(responseErrorMessage)
					} else {
						console.log(response)
					}
				})(event)
			} catch (error) {
				setErrorMessage("An error occured while login due to server")
			}
		},
		[handleSubmit, login]
	)

	useEffect(() => {
		const checkLogin = async () => {
			const loggedIn = await checkUserLogin()

			if (loggedIn.success) {
				router.push("/")
			}
		}

		checkLogin()
	}, [router])

	return (
		<form
			className="flex flex-col justify-center items-center"
			onSubmit={handleLogin}
		>
			<div>
				<div className="flex flex-col gap-2 py-2">
					<label className="text-md font-medium">Email</label>
					<input
						className="rounded p-1"
						{...register("email", { required: true, pattern: /^\S+@\S+$/i })}
						placeholder="Email"
					/>
					{errors.email && (
						<p className="text-main duration-300 ease-out">
							Please enter a valid email address.
						</p>
					)}
				</div>

				<div className="flex flex-col gap-2 py-2">
					<label className="text-md font-medium">Password</label>
					<div className="flex items-center justify-center gap-4">
						<input
							className="rounded p-1"
							id="password"
							type={passwordVisible ? "text" : "password"}
							{...register("password", { required: true })}
							placeholder="Password"
						/>
						<button
							className="duration-300 ease-in-out"
							type="button"
							onClick={togglePasswordVisibility}
						>
							{passwordVisible ? <BiHide /> : <BiShow />}
						</button>
					</div>
					{errors.password && (
						<p className="text-main duration-300 ease-out">
							Password is required.
						</p>
					)}
				</div>
			</div>
			{errorMessage && (
				<p className="text-main text-center duration-300 ease-in-out">
					{errorMessage}
				</p>
			)}
			<button
				className="cursor-pointer border-2 border-main hover:bg-main duration-300 ease-linear rounded p-0.5 px-4 my-4"
				type="submit"
			>
				Login
			</button>
		</form>
	)
}
export default LoginForm
