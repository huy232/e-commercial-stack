"use client"
import { AiOutlineDown } from "@/assets/icons"
import { FC, memo, useState, useRef, MouseEvent } from "react"
import { useClickOutside } from "@/hooks"
import { FilterCheckbox, FilterRadio, FilterInput } from "@/components"

interface FilterBarProps {
	name: string
	type: "radio" | "checkbox" | "input"
	options?: {
		paramName: string
		values: string[]
	}
	maxPrice?: number | null
	onChange?: (selectedValues: string | string[]) => void
	selectedValue?: string | string[] // Prop to handle selected value(s)
}

const FilterBar: FC<FilterBarProps> = ({
	name,
	type,
	options,
	maxPrice,
	onChange,
	selectedValue,
}) => {
	const dropdownRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)

	useClickOutside(dropdownRef, () => {
		setOpen(false)
	})

	const toggleFilterBar = () => {
		setOpen(!open)
	}

	const handleDropdownClick = (event: MouseEvent) => {
		event.stopPropagation() // Prevent click from closing the dropdown
	}

	const handleFilterChange = (selectedValues: string | string[]) => {
		if (onChange) {
			onChange(selectedValues)
		}
	}

	return (
		<div onClick={toggleFilterBar} className="relative" ref={dropdownRef}>
			<div className="p-4 text-xs gap-6 border border-gray-800 flex items-center justify-center text-gray-500 cursor-pointer">
				<span className="uppercase">{name}</span>
				<AiOutlineDown />
			</div>
			{open && (
				<div
					className="z-10 absolute top-[calc(100%-1px)] left-0 w-fit p-4 border bg-white min-w-[150px]"
					onClick={handleDropdownClick} // Prevent click from closing the dropdown
				>
					{type === "checkbox" && options && (
						<FilterCheckbox
							options={options}
							onChange={(values: string[]) => handleFilterChange(values)} // Pass string[]
							selectedValues={(selectedValue as string[]) || []} // Ensure it's an array
						/>
					)}
					{type === "radio" && options && (
						<FilterRadio
							options={options}
							onChange={(value: string) => handleFilterChange(value)} // Pass single string
							selectedValue={(selectedValue as string) || ""} // Ensure it's a string
						/>
					)}
					{type === "input" && maxPrice && <FilterInput maxPrice={maxPrice} />}
				</div>
			)}
		</div>
	)
}

export default memo(FilterBar)
