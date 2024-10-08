"use client"
import { ChangeEventHandler, useEffect, useState } from "react"
import {
	RegisterOptions,
	UseFormRegister,
	ValidationRule,
} from "react-hook-form"
import { BiShow, BiHide } from "@/assets/icons"
import { Button } from "@/components"

interface InputFieldProps {
	value?: string | number
	type?: string
	name: string
	label?: string
	register: UseFormRegister<any>
	required?: boolean | string | ValidationRule<boolean>
	pattern?: RegisterOptions["pattern"]
	errorMessage?: string
	placeholder?: string
	togglePassword?: boolean
	validate?: (value: string) => boolean | string
	minLength?: number
	readOnly?: boolean
	onChange?: ChangeEventHandler<HTMLInputElement>
	disabled?: boolean
	validateType?:
		| "email"
		| "noSpaceNoNumber"
		| "onlyWords"
		| "onlyNumbers"
		| "password"
		| "phoneNumber"
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
	onlyNumbers: /^[0-9,.]+$/,
	password: /^[^\s]+$/,
	phoneNumber: /^0\d{9,10}$/,
	custom: undefined,
}

const InputField: React.FC<InputFieldProps> = ({
	type = "text",
	name,
	label,
	register,
	required,
	pattern,
	errorMessage,
	placeholder,
	togglePassword = false,
	validate,
	minLength,
	validateType,
	readOnly = false,
	onChange,
	disabled = false,
	value,
}) => {
	const [passwordVisible, setPasswordVisible] = useState(false)

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible)
	}
	const formatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		let { value } = e.target

		if (validateType === "onlyNumbers") {
			// Remove any non-numeric characters
			value = value.replace(/[^0-9]/g, "")

			// Check if value is empty, set to "0"
			if (value === "") {
				value = "0"
			}

			// Convert to number and format with commas
			const numberValue = parseFloat(value)
			if (!isNaN(numberValue)) {
				e.target.value = numberValue.toLocaleString()
			} else {
				e.target.value = value
			}
		}
		onChange && onChange(e)
	}

	return (
		<div className="w-[320px]">
			<div className="flex flex-col gap-2 py-2">
				{label && (
					<label className="text-md font-medium capitalize">{label}</label>
				)}
				<div className="flex items-center gap-4">
					<div className="w-full">
						<input
							disabled={disabled}
							readOnly={readOnly}
							className="rounded p-1 border-[1px] border-black"
							type={
								togglePassword ? (passwordVisible ? "text" : "password") : type
							}
							value={value === null ? "" : value?.toString()} // Set the value here
							{...register(name, {
								required,
								pattern: validateType
									? validateTypePatterns[validateType]
									: pattern,
								validate: (inputValue) => {
									if (validate) {
										return validate(inputValue)
									}
									if (minLength && inputValue.length < minLength) {
										return `Password must be at least ${minLength} characters`
									}
									return true
								},
								onChange: formatInput,
							})}
							placeholder={placeholder}
							autoComplete="true"
							onBlur={formatInput}
						/>
						{togglePassword && (
							<Button
								className="hover-effect px-1"
								type="button"
								onClick={togglePasswordVisibility}
								disabled={disabled}
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
