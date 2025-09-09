"use client"
import { FaCheckSquare, FaSquare } from "@/assets/icons"
import { Button } from "@/components"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState, useEffect, useCallback } from "react"

interface FilterCheckboxProps {
	options: {
		paramName: string
		values: string[]
	}
	onChange: (selectedValues: string[]) => void // Accept array of strings
}

const FilterCheckbox: FC<FilterCheckboxProps> = ({ options, onChange }) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	const getInitialValues = useCallback(
		(paramName: string): string[] => {
			const valuesString = searchParams.get(paramName)
			return valuesString ? valuesString.split(",") : []
		},
		[searchParams]
	)

	// State to manage selected values
	const [selectedValues, setSelectedValues] = useState<string[]>([])

	// Sync state with query parameters
	useEffect(() => {
		const initialSelected = getInitialValues(options.paramName)
		setSelectedValues(initialSelected)
	}, [searchParams, options.paramName, getInitialValues])

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

	const resetFilter = () => {
		const params = new URLSearchParams(searchParams)
		params.delete(options.paramName)
		router.replace(`${pathname}?${params.toString()}`)
		setSelectedValues([])
	}

	return (
		<>
			<div className="flex flex-wrap gap-2">
				{options.values.map((value) => (
					<label key={value} className="w-fit">
						<input
							type="checkbox"
							name={options.paramName}
							value={value}
							checked={selectedValues.includes(value)}
							onChange={handleCheckboxChange}
							className="peer hidden"
						/>
						<div className="hover:bg-gray-50 flex items-center justify-between px-1 py-1 rounded cursor-pointer text-sm group peer-checked:border-blue-500 peer-checked:bg-white text-white peer-checked:text-black hover-effect hover:text-black gap-1">
							<FaCheckSquare
								size={16}
								className="text-blue-600 hidden group-[.peer:checked+&]:block"
							/>
							<FaSquare
								size={16}
								className="block group-[.peer:checked+&]:hidden"
							/>
							<span>{value}</span>
						</div>
					</label>
				))}
			</div>
			<Button
				className="mt-2 text-xs text-red-500 hover:underline"
				onClick={() => {
					resetFilter()
				}}
				type="button"
				disabled={selectedValues.length === 0}
				aria-label="Clear Selection"
				role="button"
				tabIndex={0}
				data-testid="clear-selection-button"
				id="clear-selection-button"
			>
				Clear Selection
			</Button>
		</>
	)
}

export default FilterCheckbox
