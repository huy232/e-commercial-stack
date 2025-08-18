"use client"
import { Brand } from "@/types"
import { UseFormRegister } from "react-hook-form"

interface BrandSelectProps {
	name: string
	label?: string
	register: UseFormRegister<any>
	required?: boolean
	options: Brand[]
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
		// <div className="w-[320px]">
		<div className="flex flex-col gap-2 py-2">
			{label && <label className="text-md font-medium">{label}</label>}
			<select
				className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1"
				{...register(name, { required })}
				defaultValue={normalizedValue}
				disabled={disabled}
			>
				{options.map((brand) => (
					<option key={brand._id} value={brand._id}>
						{brand.title}
					</option>
				))}
			</select>
		</div>
		// </div>
	)
}

export default BrandSelect
