"use client"
import { Button } from "@/components"
import { useDebounce } from "@/hooks"
import { formatPrice } from "@/utils"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useEffect, useState } from "react"

interface FilterInputProps {
	maxPrice: number
}

const FilterInput: FC<FilterInputProps> = ({ maxPrice }) => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { replace } = useRouter()
	const initialFromPrice = searchParams.get("from") ?? ""
	const initialToPrice = searchParams.get("to") ?? ""
	const [fromPrice, setFromPrice] = useState(initialFromPrice)
	const [toPrice, setToPrice] = useState(initialToPrice)
	const debouncedFromPrice = useDebounce(fromPrice, 1000)
	const debouncedToPrice = useDebounce(toPrice, 1000)

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			const updateURLParams = () => {
				const params = new URLSearchParams(searchParams)
				if (debouncedFromPrice !== "") {
					params.set("from", debouncedFromPrice)
				} else {
					params.delete("from")
				}
				if (debouncedToPrice !== "") {
					params.set("to", debouncedToPrice)
				} else {
					params.delete("to")
				}
				replace(`${pathname}?${params.toString()}`)
			}
			updateURLParams()
		}, 1000)

		return () => clearTimeout(timeoutId)
	}, [debouncedFromPrice, debouncedToPrice, pathname, replace, searchParams])

	const handlePriceChange = (value: string, type: "from" | "to") => {
		const parsedValue = parseInt(value, 10)

		if (!isNaN(parsedValue)) {
			if (type === "from") {
				setFromPrice(parsedValue.toString())
			} else {
				setToPrice(parsedValue.toString())
			}
		} else {
			if (type === "from") {
				setFromPrice("")
			} else {
				setToPrice("")
			}
		}
	}

	const handleReset = () => {
		const params = new URLSearchParams(searchParams)
		params.delete("from")
		params.delete("to")
		setFromPrice("")
		setToPrice("")
		replace(`${pathname}?${params.toString()}`)
	}

	return (
		<div onClick={(e) => e.stopPropagation()}>
			<div className="p-4 items-center flex justify-between gap-8">
				<span className="whitespace-nowrap">{`Max price: ${formatPrice(
					maxPrice
				)}`}</span>
				<Button
					className="underline hover:text-main"
					onClick={() => handleReset()}
					type="button"
					aria-label="Reset Price Filter"
					disabled={!fromPrice && !toPrice}
					role="button"
					tabIndex={0}
					data-testid="reset-price-filter-button"
					id="reset-price-filter-button"
					
				>
					Reset
				</Button>
			</div>
			<div className="flex items-center p-2 gap-2 text-xs">
				<div className="flex items-center gap-2">
					<label htmlFor="from">From</label>
					<input
						className="rounded h-6 focus:ring-transparent"
						type="number"
						id="from"
						value={fromPrice}
						onChange={(e) => handlePriceChange(e.target.value, "from")}
					/>
				</div>
				<div className="flex items-center gap-2">
					<label htmlFor="to">To</label>
					<input
						className="rounded h-6 focus:ring-transparent"
						type="number"
						id="to"
						value={toPrice}
						onChange={(e) => handlePriceChange(e.target.value, "to")}
					/>
				</div>
			</div>
		</div>
	)
}

export default FilterInput
