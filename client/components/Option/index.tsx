"use client"
import { FC, memo } from "react"
import { useForm, UseFormRegister } from "react-hook-form"

interface OptionProps {
	name: string
	label: string
	options: string[]
	register: UseFormRegister<any>
	required?: boolean
	defaultValue?: string
	className?: string
	onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void
	selectedColor?: string
	disabled?: boolean
}

const Option: FC<OptionProps> = ({
	name,
	label,
	options,
	register,
	required = false,
	defaultValue = "",
	className,
	onChange,
	selectedColor,
	disabled,
}) => {
	return (
		<div className="w-[320px]">
			<label className="py-2" htmlFor={name}>
				{label}
			</label>
			<select
				className="py-2 rounded border-2 border-red-500 px-[4px] mx-1"
				{...register(name, { required })}
				defaultValue={defaultValue}
				onChange={onChange}
				value={selectedColor}
				disabled={disabled}
			>
				{options.map((option, index) => (
					<option key={index} value={option}>
						{option}
					</option>
				))}
			</select>
		</div>
	)
}

export default memo(Option)
