"use client"
import { AiOutlineDown } from "@/assets/icons"
import { colors } from "@/constant"
import { FC, memo, useState, useRef } from "react"
import { useClickOutside } from "@/hooks"

interface FilterBarProps {
	name: string
	activeClick?: string | null
	onActiveClick: (name: string | null) => void
	type?: string
}

const FilterBar: FC<FilterBarProps> = ({
	name,
	activeClick,
	onActiveClick,
	type = "checkbox",
}) => {
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [selected, setSelected] = useState<string[]>([])

	useClickOutside(wrapperRef, () => {
		onActiveClick(null)
	})

	const handleSelect = (color: string) => {
		if (selected.includes(color)) {
			setSelected(selected.filter((c) => c !== color))
		} else {
			setSelected([...selected, color])
		}
	}

	return (
		<div
			className="p-4 text-xs gap-6 relative border border-gray-800 flex items-center justify-center text-gray-500"
			onClick={() => onActiveClick(name)}
		>
			<span className="uppercase">{name}</span>
			<AiOutlineDown />
			{activeClick === name && (
				<div className="z-10 absolute top-[calc(100%+1px)] left-0 w-fit p-4 border bg-white min-w-[150px]">
					{type === "checkbox" && (
						<div ref={wrapperRef}>
							<div className="p-4 items-center flex justify-between gap-8">
								<span className="whitespace-nowrap">{`${selected.length} selected`}</span>
								<button className="underline hover:text-main">Reset</button>
							</div>
							<div
								className="flex flex-col gap-3"
								onClick={(e) => e.stopPropagation()}
							>
								{colors.map((color, index) => (
									<div key={index} className="flex items-center gap-4">
										<input
											type="checkbox"
											name={color}
											value={color}
											checked={selected.includes(color)}
											onChange={() => handleSelect(color)}
											className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500"
										/>
										<label className="capitalize text-gray-700" htmlFor={color}>
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
