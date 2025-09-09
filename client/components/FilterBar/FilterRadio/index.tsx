"use client"
import { FaCircle, FaCircleCheck } from "@/assets/icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState } from "react"
import { Button } from "@/components"

interface FilterRadioProps {
	options: {
		paramName: string
		values: string[]
	}
	onChange: (selectedValue: string) => void // Accept single string value
}

const FilterRadio: FC<FilterRadioProps> = ({ options, onChange }) => {
	// Get URL search params and handle initial value from the URL
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const router = useRouter()

	const getInitialValue = (paramName: string): string => {
		return searchParams.get(paramName) || ""
	}

	// Get initial selected value from the URL
	const initialSelected = getInitialValue(options.paramName)
	const [selectedValue, setSelectedValue] = useState<string>(initialSelected)

	const handleRadioChange = (event: React.MouseEvent<HTMLInputElement>) => {
		const value = (event.target as HTMLInputElement).value
		const newParams = new URLSearchParams(searchParams)

		// Select new value
		newParams.set(options.paramName, value)
		setSelectedValue(value)
		onChange(value)

		router.replace(`${pathname}?${newParams.toString()}`)
	}

	const resetFilterRadio = (paramName = options.paramName) => {
		setSelectedValue("") // Clear the selected value

		// Create a new URLSearchParams based on the current searchParams
		const params = new URLSearchParams()
		params.delete(paramName)

		// Retain the sort parameter if it exists
		const sort = searchParams.get("sort")
		const page = searchParams.get("page")
		if (sort) {
			params.set("sort", sort)
		}
		if (page) {
			params.set("page", page)
		}

		// Update the URL with only the sort parameter (if any)
		router.replace(`${pathname}?${params.toString()}`)
	}

	return (
		<>
			<div className="flex flex-wrap gap-2">
				{options.values.map((value) => (
					<label key={value} className="w-fit">
						<input
							type="radio"
							name={options.paramName}
							value={value}
							// Convert both selectedValue and value to lowercase for comparison
							checked={selectedValue.toLowerCase() === value.toLowerCase()}
							// onChange={handleRadioChange}
							onClick={(e) => {
								const target = e.currentTarget
								const value = target.value
								if (selectedValue.toLowerCase() === value.toLowerCase()) {
									resetFilterRadio()
								} else {
									handleRadioChange(e)
								}
							}}
							className="peer hidden"
						/>
						<div className="hover:bg-gray-50 flex items-center justify-between px-1 py-1 border-2 rounded cursor-pointer text-sm group peer-checked:border-blue-500 peer-checked:bg-white text-white peer-checked:text-black hover-effect hover:text-black">
							<span className="font-medium mr-[0.2rem] mb-[0.2rem]">
								{value}
							</span>
							<FaCircleCheck
								size={16}
								className="text-blue-600 hidden group-[.peer:checked+&]:block"
							/>
							<FaCircle
								size={16}
								className="block group-[.peer:checked+&]:hidden"
							/>
						</div>
					</label>
				))}
			</div>
			<Button
				className="mt-2 text-xs text-red-500 hover:underline"
				onClick={() => {
					resetFilterRadio()
				}}
				type="button"
				disabled={!selectedValue}
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

export default FilterRadio
