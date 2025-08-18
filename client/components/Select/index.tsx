"use client"
import { UseFormRegister } from "react-hook-form"

interface SelectProps<T> {
	name: string
	label?: string
	register: UseFormRegister<any>
	required?: boolean
	options: T[]
	getValue: (option: T) => string
	getLabel: (option: T) => string
	value?: string | undefined
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
	disabled?: boolean
}

const Select = <T extends any>({
	name,
	label,
	register,
	required = false,
	options,
	getValue,
	getLabel,
	value,
	onChange,
	disabled = false,
}: SelectProps<T>) => {
	return (
		// <div className="w-[320px] md:w-full">
		<div className="flex flex-col gap-2 py-2">
			{label && <label className="text-md font-medium">{label}</label>}
			<select
				className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1"
				{...register(name, { required })}
				onChange={onChange}
				value={value}
				disabled={disabled}
			>
				{options.map((option, index) => {
					return (
						<option key={index} value={getValue(option)}>
							{getLabel(option)}
						</option>
					)
				})}
			</select>
		</div>
		// </div>
	)
}

export default Select
