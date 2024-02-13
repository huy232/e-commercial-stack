"use client"
import { AiOutlineDown } from "@/assets/icons"
import { colors } from "@/constant"
import { FC, memo, useState, useRef, useCallback } from "react"
import { useClickOutside } from "@/hooks"
import { useSearchParams, useRouter, usePathname } from "next/navigation"

interface FilterBarProps {
	name: string
	type?: string
}

const FilterBar: FC<FilterBarProps> = ({ name, type = "checkbox" }) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const dropdownRef = useRef<HTMLDivElement>(null)
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState<string[]>([])

	useClickOutside(dropdownRef, (event) => {
		setOpen(false)
	})

	const toggleFilterBar = () => {
		setOpen(!open)
	}

	const handleSelect = (color: string) => {
		const updatedSelected = selected.includes(color)
			? selected.filter((otherColor) => otherColor !== color)
			: [...selected, color]

		setSelected(updatedSelected)

		const params = new URLSearchParams(searchParams)
		const allColors = params.getAll("color")

		allColors.forEach((currentColor) => {
			params.delete("color")
		})

		updatedSelected.forEach((selectedColor) => {
			params.append("color", selectedColor)
		})

		replace(`${pathname}?${params.toString()}`)
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
					{type === "checkbox" && (
						<div onClick={(e) => e.stopPropagation()}>
							<div className="p-4 items-center flex justify-between gap-8">
								<span className="whitespace-nowrap">{`${selected.length} selected`}</span>
								<button className="underline hover:text-main">Reset</button>
							</div>
							<div className="flex flex-col gap-3">
								{colors.map((color, index) => (
									<div key={index} className="flex items-center gap-4">
										<input
											type="checkbox"
											id={`checkbox-${color}`}
											name={color}
											value={color}
											checked={selected.includes(color)}
											onChange={() => handleSelect(color)}
											className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus-within:bg-white"
										/>
										<label
											htmlFor={`checkbox-${color}`}
											className="capitalize text-gray-700 cursor-pointer w-full"
										>
											{color}
										</label>
									</div>
								))}
							</div>
						</div>
					)}
				</div>
			)}
		</div>
	)
}

export default memo(FilterBar)
