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

	useEffect(() => {
		const sortParamExists = searchParams.has("sort")
		if (!sortParamExists) {
			setSelectedSort(options[0].value)
			return
		}
		const currentSort = searchParams.get("sort") ?? ""
		if (selectedSort !== currentSort) {
			setSelectedSort(currentSort)
		}
	}, [selectedSort, searchParams, pathname, replace, options])

	const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newSortValue = e.target.value
		setSelectedSort(newSortValue)
		const params = new URLSearchParams(searchParams)
		params.set("sort", newSortValue)
		replace(`${pathname}?${params.toString()}`)
	}

	return (
		<select
			className="form-select"
			value={selectedSort}
			onChange={handleSortChange}
		>
			{options.map((option) => (
				<option key={option.id} value={option.value}>
					{option.text}
				</option>
			))}
		</select>
	)
}
export default memo(InputSelect)
