"use client"
import { UseFormRegister } from "react-hook-form"

interface BrandSelectProps {
	name: string
	label?: string
	register: UseFormRegister<any>
	required?: boolean
	options: string[]
	value?: string | undefined
	disabled?: boolean
}

const BrandSelect: React.FC<BrandSelectProps> = ({
	name,
	label,
	register,
	required = false,
	options,
	value,
	disabled,
}) => {
	const normalizedValue = value
		? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
		: ""
	return (
		<div className="w-[320px]">
			<div className="flex flex-col gap-2 py-2">
				{label && <label className="text-md font-medium">{label}</label>}
				<select
					className="rounded p-1 border-[1px] border-black"
					{...register(name, { required })}
					defaultValue={normalizedValue}
					disabled={disabled}
				>
					{options.map((brand, index) => (
						<option key={index} value={brand}>
							{brand}
						</option>
					))}
				</select>
			</div>
		</div>
	)
}

export default BrandSelect
