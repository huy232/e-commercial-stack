"use client"
import { ChangeEventHandler, useEffect, useState } from "react"
import {
	RegisterOptions,
	UseFormRegister,
	ValidationRule,
} from "react-hook-form"
import { BiShow, BiHide } from "@/assets/icons"
import { Button } from "@/components"
import { inputClass } from "@/utils"
import clsx from "clsx"

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
	inputAdditionalClass?: string
	labelClassName?: string
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
	inputAdditionalClass,
	labelClassName,
}) => {
	const [passwordVisible, setPasswordVisible] = useState(false)

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible)
	}
	const formatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (validateType !== "onlyNumbers") {
			onChange && onChange(e)
			return
		}

		let { value } = e.target
		value = value.replace(/[^0-9]/g, "")

		if (value) {
			const numberValue = parseFloat(value)
			e.target.value = isNaN(numberValue) ? "" : numberValue.toLocaleString()
		} else {
			e.target.value = "0"
		}

		onChange && onChange(e)
	}

	return (
		<>
			{label && (
				<label className={clsx("text-md font-medium mr-1", labelClassName)}>
					{label}
				</label>
			)}
			<div className="relative w-full">
				<input
					disabled={disabled}
					readOnly={readOnly}
					className={clsx(
						"w-full", // Ensure full width
						togglePassword && "pr-10", // Add right padding only if togglePassword is enabled
						inputClass(inputAdditionalClass)
					)}
					type={togglePassword ? (passwordVisible ? "text" : "password") : type}
					value={value === null ? "" : value?.toString()}
					{...register(name, {
						required,
						pattern: validateType
							? validateTypePatterns[validateType]
							: pattern,
						validate: (inputValue) => {
							if (validate) return validate(inputValue)
							if (minLength && inputValue.length < minLength)
								return `Password must be at least ${minLength} characters`
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
						className="absolute right-2 top-1/2 -translate-y-1/2 px-1"
						type="button"
						onClick={togglePasswordVisibility}
						disabled={disabled}
					>
						{passwordVisible ? <BiHide /> : <BiShow />}
					</Button>
				)}
				{errorMessage && (
					<p className="text-main hover-effect">{errorMessage}</p>
				)}
			</div>
		</>
	)
}

export default InputField
