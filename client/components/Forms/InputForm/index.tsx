"use client"
import { inputClass } from "@/utils"
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
	errorMessage: { [key: string]: CustomFieldError } | undefined
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
	errorMessage,
	id,
	validate,
	type = "text",
	placeholder,
	fullWidth,
	defaultValue,
	className,
}) => {
	const inputClassName = clsx(inputClass(className), fullWidth && "w-full")
	return (
		<div className="flex flex-col gap-1">
			{label && <label htmlFor={id}>{label}</label>}
			<input
				type={type}
				id={id || ""}
				{...register(id || "", { validate })}
				disabled={disabled}
				placeholder={placeholder}
				className={inputClassName}
				defaultValue={defaultValue}
			/>
			{errorMessage && id && errorMessage[id]?.message && (
				<small className="text-xs text-red-500">
					{errorMessage[id]?.message}
				</small>
			)}
		</div>
	)
}

export default memo(InputForm)
