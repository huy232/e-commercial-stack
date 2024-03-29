"use client"
import clsx from "clsx"
import { FC, memo } from "react"
import { FieldError, FieldValues, UseFormRegister } from "react-hook-form"

interface CustomFieldError extends FieldError {
	message: string
}

interface InputFormProps<T extends FieldValues> {
	label?: string
	disabled?: boolean
	register: UseFormRegister<T>
	errors: { [key: string]: CustomFieldError } | undefined
	id?: string
	validate?: (value: any) => boolean | string | Promise<boolean | string>
	type?: string
	placeholder?: string
	fullWidth?: boolean
	defaultValue?: string
	className?: string
}

const InputForm: FC<InputFormProps<any>> = ({
	label,
	disabled,
	register,
	errors,
	id,
	validate,
	type = "text",
	placeholder,
	fullWidth,
	defaultValue,
	className,
}) => {
	const inputClass = clsx(
		"form-input rounded",
		fullWidth && "w-full",
		className
	)
	return (
		<div className="flex flex-col gap-2">
			{label && <label htmlFor={id}>{label}</label>}
			<input
				type={type}
				id={id || ""}
				{...register(id || "", { validate })}
				disabled={disabled}
				placeholder={placeholder}
				className={inputClass}
				defaultValue={defaultValue}
			/>
			{errors && id && errors[id]?.message && (
				<small className="text-xs text-red-500">{errors[id]?.message}</small>
			)}
		</div>
	)
}

export default memo(InputForm)
