"use client"
import { useState } from "react"
import { RegisterOptions, UseFormRegister } from "react-hook-form"
import { BiShow, BiHide } from "@/assets/icons"

interface InputFieldProps {
	type?: string
	name: string
	label: string
	register: UseFormRegister<any>
	required?: boolean
	pattern?: RegisterOptions["pattern"]
	errorMessage?: string
	placeholder?: string
	togglePassword?: boolean
	validate?: (value: string) => boolean | string
}

const InputField: React.FC<InputFieldProps> = ({
	type = "text",
	name,
	label,
	register,
	required = false,
	pattern,
	errorMessage,
	placeholder,
	togglePassword = false,
	validate,
}) => {
	const [passwordVisible, setPasswordVisible] = useState(false)

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible)
	}

	return (
		<div className="w-[320px]">
			<div className="flex flex-col gap-2 py-2">
				<label className="text-md font-medium">{label}</label>
				<div className="flex items-center gap-4">
					<div className="w-full">
						<input
							className="rounded p-1 border-[1px] border-black"
							type={
								togglePassword ? (passwordVisible ? "text" : "password") : type
							}
							{...register(name, { required, pattern, validate })}
							placeholder={placeholder}
						/>
						{togglePassword && (
							<button
								className="duration-300 ease-in-out px-1"
								type="button"
								onClick={togglePasswordVisibility}
							>
								{passwordVisible ? <BiHide /> : <BiShow />}
							</button>
						)}
					</div>
				</div>
			</div>
			{errorMessage && (
				<p className="text-main duration-300 ease-in-out">{errorMessage}</p>
			)}
		</div>
	)
}

export default InputField
