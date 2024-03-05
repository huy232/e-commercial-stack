"use client"
import clsx from "clsx"
import { FC, memo } from "react"
import { FieldError, FieldValues, UseFormRegister } from "react-hook-form"

interface CustomFieldError extends FieldError {
	message: string
}

interface InputFormProps {
	label?: string
	disabled?: boolean
	register: UseFormRegister<FieldValues>
	errors: { [key: string]: CustomFieldError } | undefined
	id?: string
	validate?: (value: any) => boolean | string | Promise<boolean | string>
	type?: string
	placeholder?: string
	fullWidth?: boolean
	defaultValue?: string
}

const InputForm: FC<InputFormProps> = ({
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
}) => {
	return (
		<div className="flex flex-col h-[80px] gap-2">
			{label && <label htmlFor={id}>{label}</label>}
			<input
				type={type}
				id={id || ""}
				{...register(id || "", { validate })}
				disabled={disabled}
				placeholder={placeholder}
				className={clsx("form-input", fullWidth && "w-full")}
				defaultValue={defaultValue}
			/>
			{errors && id && errors[id]?.message && (
				<small className="text-xs text-red-500">{errors[id]?.message}</small>
			)}
		</div>
	)
}

export default memo(InputForm)
