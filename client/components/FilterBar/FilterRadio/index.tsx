"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useState } from "react"

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
	console.log(selectedValue)

	const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setSelectedValue(value)
		onChange(value)

		// Update URL params
		const params = new URLSearchParams(searchParams)
		params.set(options.paramName, value)
		router.replace(`${pathname}?${params.toString()}`)
	}

	return (
		<div>
			{options.values.map((value) => (
				<label key={value}>
					<input
						type="radio"
						name={options.paramName}
						value={value}
						// Convert both selectedValue and value to lowercase for comparison
						checked={selectedValue.toLowerCase() === value.toLowerCase()}
						onChange={handleRadioChange}
					/>
					{value}
				</label>
			))}
		</div>
	)
}

export default FilterRadio
