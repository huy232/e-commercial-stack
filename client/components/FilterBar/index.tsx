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
}) => {
	const dropdownRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)

	useClickOutside(dropdownRef, () => {
		setOpen(false)
	})

	const toggleFilterBar = () => {
		setOpen(!open)
	}

	const handleFilterChange = (selectedValues: string | string[]) => {
		if (onChange) {
			onChange(selectedValues)
		}
	}

	return (
		<div onClick={toggleFilterBar} className="" ref={dropdownRef}>
			<div className="p-1 text-xs flex items-center">
				<span className="inline-block font-bold text-base text-white">
					{name}
				</span>
				{/* <AiOutlineDown /> */}
			</div>
			{/* {open && ( */}
			<div
				className="w-full px-2 mt-1 text-white/70"
				// onClick={handleDropdownClick} // Prevent click from closing the dropdown
			>
				{type === "checkbox" && options && (
					<FilterCheckbox
						options={options}
						onChange={(values: string[]) => handleFilterChange(values)} // Pass string[]
					/>
				)}
				{type === "radio" && options && (
					<FilterRadio
						options={options}
						onChange={(value: string) => handleFilterChange(value)} // Pass single string
					/>
				)}
				{type === "input" && maxPrice && <FilterInput maxPrice={maxPrice} />}
			</div>
			{/* )} */}
		</div>
	)
}

export default memo(FilterBar)
