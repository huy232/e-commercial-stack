"use client"
import { useState, useEffect } from "react"
import {
	RegisterOptions,
	UseFormRegister,
	UseFormSetValue,
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
	setValue?: UseFormSetValue<any>
	required?: boolean | string
	pattern?: RegisterOptions["pattern"]
	errorMessage?: string
	placeholder?: string
	togglePassword?: boolean
	validate?: (value: string) => boolean | string
	minLength?: number
	readOnly?: boolean
	onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
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
	maxLength?: number
}

const validateTypePatterns = {
	email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
	noSpaceNoNumber: /^[^\s0-9]+$/,
	onlyWords: /^[A-Za-zÀ-ỹà-ỹĂăÂâĐđÊêÔôƠơƯư\s]+$/,
	onlyNumbers: /^[0-9,.]+$/,
	password: /^[^\s]+$/,
	phoneNumber: /^0\d{9,10}$/,
	custom: undefined,
} as const

// default max lengths based on field name or type
const defaultMaxLength = (name: string, validateType?: string) => {
	if (validateType === "email") return 100
	if (validateType === "password") return 50
	if (validateType === "phoneNumber") return 11
	if (validateType === "noSpaceNoNumber" || validateType === "onlyWords")
		return 50
	return 255
}

const InputField: React.FC<InputFieldProps> = ({
	type = "text",
	name,
	label,
	register,
	setValue,
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
	maxLength,
}) => {
	const [passwordVisible, setPasswordVisible] = useState(false)

	const togglePasswordVisibility = () => {
		setPasswordVisible(!passwordVisible)
	}

	const appliedMaxLength = maxLength ?? defaultMaxLength(name, validateType)

	const formatInput = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (validateType !== "onlyNumbers") {
			onChange && onChange(e)
			return
		}

		let val = e.target.value
		val = val.replace(/[^0-9]/g, "").slice(0, appliedMaxLength) // enforce maxLength

		if (val) {
			const numberValue = parseFloat(val)
			e.target.value = isNaN(numberValue) ? "" : numberValue.toLocaleString()
		} else {
			e.target.value = "0"
		}

		onChange && onChange(e)
	}

	useEffect(() => {
		if (!setValue) return
		const input = document.querySelector<HTMLInputElement>(
			`input[name="${name}"]`
		)
		if (input && input.value) {
			setValue(name, input.value, { shouldValidate: true })
		}
	}, [name, setValue])

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
						"w-full",
						togglePassword && "pr-10",
						inputClass(inputAdditionalClass)
					)}
					type={togglePassword ? (passwordVisible ? "text" : "password") : type}
					placeholder={placeholder}
					autoComplete={
						name === "firstName"
							? "given-name"
							: name === "lastName"
							? "family-name"
							: name === "email"
							? "email"
							: type === "password"
							? "new-password"
							: "on"
					}
					maxLength={appliedMaxLength}
					{...register(name, {
						required,
						pattern: validateType
							? validateTypePatterns[validateType]
							: pattern,
						validate: (inputValue) => {
							if (minLength && inputValue.length < minLength)
								return `Must be at least ${minLength} characters`
							if (inputValue.length > appliedMaxLength)
								return `Must be at most ${appliedMaxLength} characters`
							if (validate) return validate(inputValue)
							return true
						},
						onChange: formatInput,
					})}
					defaultValue={value}
				/>
				{togglePassword && (
					<Button
						className="absolute right-2 top-1/2 -translate-y-1/2 px-1"
						type="button"
						onClick={togglePasswordVisibility}
						disabled={disabled}
						aria-label={passwordVisible ? "Hide password" : "Show password"}
						role="button"
						tabIndex={0}
						data-testid="toggle-password-visibility-button"
						id="toggle-password-visibility-button"
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
