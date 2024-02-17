"use client"
import { AiOutlineDown } from "@/assets/icons"
import { FC, memo, useState, useRef } from "react"
import { useClickOutside } from "@/hooks"
import { FilterCheckbox, FilterInput } from "@/components"

interface FilterBarProps {
	name: string
	type: string
	options?: {
		paramName: string
		values: string[]
	}
	maxPrice?: number | null
}

const FilterBar: FC<FilterBarProps> = ({ name, type, options, maxPrice }) => {
	const dropdownRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)

	useClickOutside(dropdownRef, (event) => {
		setOpen(false)
	})

	const toggleFilterBar = () => {
		setOpen(!open)
	}

	return (
		<div
			onClick={() => toggleFilterBar()}
			className="relative"
			ref={dropdownRef}
		>
			<div className="p-4 text-xs gap-6 border border-gray-800 flex items-center justify-center text-gray-500">
				<span className="uppercase">{name}</span>
				<AiOutlineDown />
			</div>
			{open && (
				<div className="z-10 absolute top-[calc(100%-1px)] left-0 w-fit p-4 border bg-white min-w-[150px]">
					{type === "checkbox" && options && (
						<FilterCheckbox options={options} />
					)}
					{type === "input" && maxPrice && <FilterInput maxPrice={maxPrice} />}
				</div>
			)}
		</div>
	)
}

export default memo(FilterBar)
