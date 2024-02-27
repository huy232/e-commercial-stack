"use client"
import { useState } from "react"
import { RegisterOptions, UseFormRegister } from "react-hook-form"
import { BiShow, BiHide } from "@/assets/icons"
import { Button } from "@/components"

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
	minLength?: number

	validateType?:
		| "email"
		| "noSpaceNoNumber"
		| "onlyWords"
		| "onlyNumbers"
		| "password"
		| "custom"
		| undefined
}
type ValidationPattern = RegExp | undefined

const validateTypePatterns: Record<
	NonNullable<InputFieldProps["validateType"]>,
	ValidationPattern
> = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	noSpaceNoNumber: /^[^\s0-9]+$/,
	onlyWords: /^[A-Za-z\s]+$/,
	onlyNumbers: /^[0-9]+$/,
	password: /^[^\s]+$/,
	custom: undefined,
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
	minLength,
	validateType,
}) => {
	const [passwordVisible, setPasswordVisible] = useState(false)

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible)
	}

	const selectedPattern =
		validateType !== undefined
			? validateTypePatterns[
					validateType as NonNullable<InputFieldProps["validateType"]>
			  ]
			: undefined

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
							{...register(name, {
								required,
								pattern: selectedPattern,
								validate: (value) => {
									if (minLength && value.length < minLength) {
										return `Password must be at least ${minLength} characters`
									}
									if (validate) {
										return validate(value)
									}
									return true
								},
							})}
							placeholder={placeholder}
							autoComplete="true"
						/>
						{togglePassword && (
							<Button
								className="hover-effect px-1"
								type="button"
								onClick={togglePasswordVisibility}
							>
								{passwordVisible ? <BiHide /> : <BiShow />}
							</Button>
						)}
					</div>
				</div>
			</div>
			{errorMessage && <p className="text-main hover-effect">{errorMessage}</p>}
		</div>
	)
}

export default InputField
