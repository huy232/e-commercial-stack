"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface FilterOptions {
	paramName: string
	values: string[]
}

interface FilterCheckboxProps {
	options: FilterOptions
}

const FilterCheckbox: FC<FilterCheckboxProps> = ({ options }) => {
	const getInitialValues = (
		searchParams: URLSearchParams,
		paramName: string
	): string[] => {
		const valuesString = searchParams.get(paramName)
		return valuesString ? valuesString.split(",") : []
	}
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const initialSelected = getInitialValues(searchParams, options.paramName)
	const [selected, setSelected] = useState<string[]>(initialSelected)

	const handleSelect = (value: string) => {
		const updatedSelected = selected.includes(value)
			? selected.filter((otherValue) => otherValue !== value)
			: [...selected, value]

		setSelected(updatedSelected)

		const selectedValuesString = updatedSelected.join(",")
		const params = new URLSearchParams(searchParams)
		if (updatedSelected.length > 0) {
			params.set(options.paramName, selectedValuesString)
		} else {
			params.delete(options.paramName)
		}

		replace(`${pathname}?${params.toString()}`)
	}

	return (
		<div onClick={(e) => e.stopPropagation()}>
			<div className="p-4 items-center flex justify-between gap-8 text-md">
				<span className="whitespace-nowrap">{`${selected.length} selected`}</span>
				<button className="underline hover:text-main">Reset</button>
			</div>
			<div className="flex flex-col gap-3 text-xs">
				{options.values.map((option, index) => (
					<div key={index} className="flex items-center gap-4">
						<input
							type="checkbox"
							id={`checkbox-${option}`}
							name={option}
							value={option}
							checked={selected.includes(option)}
							onChange={() => handleSelect(option)}
							className="w-4 h-4 rounded focus:ring-0 focus:ring-transparent"
						/>
						<label
							htmlFor={`checkbox-${option}`}
							className="capitalize text-gray-700 cursor-pointer w-full"
						>
							{option}
						</label>
					</div>
				))}
			</div>
		</div>
	)
}

export default FilterCheckbox
