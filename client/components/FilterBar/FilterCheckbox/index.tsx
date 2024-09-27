"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState } from "react"

interface FilterCheckboxProps {
	options: {
		paramName: string
		values: string[]
	}
	onChange: (selectedValues: string[]) => void // Accept array of strings
}

const FilterCheckbox: FC<FilterCheckboxProps> = ({ options, onChange }) => {
	// Get URL search params and handle initial values from the URL
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	const getInitialValues = (paramName: string): string[] => {
		const valuesString = searchParams.get(paramName)
		return valuesString ? valuesString.split(",") : []
	}

	// Get initial selected values from the URL
	const initialSelected = getInitialValues(options.paramName)
	const [selectedValues, setSelectedValues] =
		useState<string[]>(initialSelected)

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		const newValues = event.target.checked
			? [...selectedValues, value]
			: selectedValues.filter((v) => v !== value)

		setSelectedValues(newValues)
		onChange(newValues)

		// Update URL params
		const params = new URLSearchParams(searchParams)
		if (newValues.length > 0) {
			params.set(options.paramName, newValues.join(","))
		} else {
			params.delete(options.paramName)
		}
		router.replace(`${pathname}?${params.toString()}`)
	}

	return (
		<div>
			{options.values.map((value) => (
				<label key={value}>
					<input
						type="checkbox"
						name={options.paramName}
						value={value}
						checked={selectedValues.includes(value)}
						onChange={handleCheckboxChange}
					/>
					{value}
				</label>
			))}
		</div>
	)
}

export default FilterCheckbox
