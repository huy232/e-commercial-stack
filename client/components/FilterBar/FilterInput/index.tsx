"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import { formatPrice } from "../../../utils/formatPrice"

const FilterInput = () => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { replace } = useRouter()

	const min = 0
	const max = 99000000
	const initialFrom = Number(searchParams.get("from") ?? min)
	const initialTo = Number(searchParams.get("to") ?? max)

	const [from, setFrom] = useState(initialFrom)
	const [to, setTo] = useState(initialTo)

	const [debouncedFrom, setDebouncedFrom] = useState(from)
	const [debouncedTo, setDebouncedTo] = useState(to)

	// Debounce timer
	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedFrom(from)
			setDebouncedTo(to)
		}, 800)
		return () => clearTimeout(handler)
	}, [from, to])

	// Sync debounced values to URL params
	useEffect(() => {
		const params = new URLSearchParams(searchParams)
		if (debouncedFrom > min) params.set("from", String(debouncedFrom))
		else params.delete("from")

		if (debouncedTo < max) params.set("to", String(debouncedTo))
		else params.delete("to")

		replace(`${pathname}?${params.toString()}`)
	}, [debouncedFrom, debouncedTo, pathname, replace, searchParams])

	const handleReset = () => {
		setFrom(min)
		setTo(max)
		const params = new URLSearchParams(searchParams)
		params.delete("from")
		params.delete("to")
		replace(`${pathname}?${params.toString()}`)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 10 }}
			animate={{ opacity: 1, y: 0 }}
			className="p-4 space-y-4 rounded-lg border bg-white shadow-md"
		>
			<div className="flex justify-between items-center">
				<span className="font-semibold text-gray-700">Price Range</span>
				<button
					onClick={handleReset}
					className="text-sm text-red-500 hover:underline disabled:text-gray-400"
					disabled={from === min && to === max}
				>
					Reset
				</button>
			</div>

			{/* Slider */}
			<div className="relative w-full h-6 flex items-center">
				<div className="absolute w-full h-2 bg-gray-200 rounded-full" />
				<div
					className="absolute h-2 bg-blue-400 rounded-full"
					style={{
						left: `${(from / max) * 100}%`,
						width: `${((to - from) / max) * 100}%`,
					}}
				/>
				<input
					type="range"
					min={min}
					max={max}
					value={from}
					onChange={(e) => setFrom(Math.min(Number(e.target.value), to - 1))}
					className="absolute w-full appearance-none bg-transparent pointer-events-none 
					[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
					[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 
					[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
					[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500"
				/>
				<input
					type="range"
					min={min}
					max={max}
					value={to}
					onChange={(e) => setTo(Math.max(Number(e.target.value), from + 1))}
					className="absolute w-full appearance-none bg-transparent pointer-events-none 
					[&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 
					[&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-500 
					[&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:pointer-events-auto
					[&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-blue-500"
				/>
			</div>

			{/* Inputs */}
			<div className="flex justify-between gap-2">
				<div className="flex flex-col w-1/2">
					<label className="text-xs text-gray-500">From</label>
					<input
						type="number"
						className="border rounded p-1 text-sm text-gray-800 bg-white"
						value={from}
						min={min}
						max={max}
						onChange={(e) => {
							const val = Number(e.target.value)
							if (isNaN(val)) return setFrom(min)
							setFrom(Math.max(min, Math.min(val, to - 1)))
						}}
					/>
					<span className="text-xs text-gray-500">{formatPrice(from)}</span>
				</div>

				<div className="flex flex-col w-1/2">
					<label className="text-xs text-gray-500">To</label>
					<input
						type="number"
						className="border rounded p-1 text-sm text-gray-800 bg-white"
						value={to}
						min={min}
						max={max}
						onChange={(e) => {
							const val = Number(e.target.value)
							if (isNaN(val)) return setTo(max)
							setTo(Math.min(max, Math.max(val, from + 1)))
						}}
					/>
					<span className="text-xs text-gray-500">{formatPrice(to)}</span>
				</div>
			</div>
		</motion.div>
	)
}

export default FilterInput
