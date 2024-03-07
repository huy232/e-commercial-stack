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
	onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

const Select = <T extends any>({
	name,
	label,
	register,
	required = false,
	options,
	getValue,
	getLabel,
	onChange,
}: SelectProps<T>) => {
	return (
		<div className="w-[320px]">
			<div className="flex flex-col gap-2 py-2">
				{label && <label className="text-md font-medium">{label}</label>}
				<select
					className="rounded p-1 border-[1px] border-black"
					{...register(name, { required })}
					onChange={onChange}
				>
					{options.map((option, index) => (
						<option key={index} value={getValue(option)}>
							{getLabel(option)}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}

export default Select
