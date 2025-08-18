"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { memo, FC, useState, useEffect } from "react"

interface InputSelectProps {
	options: { id: number; value: string; text: string }[]
}

const InputSelect: FC<InputSelectProps> = ({ options }) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const initialSelected = searchParams.get("sort") ?? options[0].value
	const [selectedSort, setSelectedSort] = useState<string>(initialSelected)

	// useEffect(() => {
	// 	const sortParamExists = searchParams.has("sort")
	// 	if (!sortParamExists) {
	// 		setSelectedSort(options[0].value)
	// 		return
	// 	}
	// 	const currentSort = searchParams.get("sort") ?? ""
	// 	if (selectedSort !== currentSort) {
	// 		setSelectedSort(currentSort)
	// 	}
	// }, [selectedSort, searchParams, pathname, replace, options])

	const handleSortChange = (newSortValue: string) => {
		setSelectedSort(newSortValue)
		const params = new URLSearchParams(searchParams)
		params.set("sort", newSortValue)
		replace(`${pathname}?${params.toString()}`)
	}

	return (
		<div className="flex flex-col gap-2 text-white w-full px-2 pb-4">
			{options.map((option) => (
				<label
					key={option.id}
					className="flex items-center gap-2 cursor-pointer"
				>
					<input
						type="radio"
						name="sort"
						value={option.value}
						checked={selectedSort === option.value}
						onChange={(e) => handleSortChange(e.target.value)}
						className="form-radio"
					/>
					<span>{option.text}</span>
				</label>
			))}
		</div>
	)
}
export default memo(InputSelect)
