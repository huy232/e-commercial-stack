"use client"
import clsx from "clsx"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { Button } from "@/components"
import { FC } from "react"

interface SortColumnProps {
	label: string
	field: string
	currentSortBy: string
	currentOrder: string
}

const SortColumn: FC<SortColumnProps> = ({
	label,
	field,
	currentSortBy,
	currentOrder,
}) => {
	const pathname = usePathname()
	const searchParams = useSearchParams()
	const { replace } = useRouter()

	const isActive = currentSortBy === field
	const nextOrder = isActive && currentOrder === "asc" ? "desc" : "asc"

	const handleClick = () => {
		const params = new URLSearchParams(searchParams)
		params.set("sortBy", field)
		params.set("order", nextOrder)
		params.set("page", "1")
		replace(`${pathname}?${params.toString()}`)
	}

	return (
		<Button
			onClick={handleClick}
			className={clsx(
				`text-sm font-semibold px-2 py-1 rounded hover:underline text-left`,
				isActive ? "text-main" : "text-gray-600"
			)}
			aria-pressed={isActive}
			aria-label={`Sort by ${label} in ${nextOrder} order`}
			role="button"
			tabIndex={0}
			data-testid={`sort-by-${field}-button`}
			id={`sort-by-${field}-button`}
		>
			{label} {isActive ? (currentOrder === "asc" ? "↑" : "↓") : ""}
		</Button>
	)
}

const SortControls = () => {
	const searchParams = useSearchParams()
	const sortBy = searchParams.get("sortBy") || "createdAt"
	const order = searchParams.get("order") || "desc"

	return (
		<>
			<SortColumn
				label="Blog Title"
				field="title"
				currentSortBy={sortBy}
				currentOrder={order}
			/>
			<SortColumn
				label="Author"
				field="username"
				currentSortBy={sortBy}
				currentOrder={order}
			/>
			<SortColumn
				label="Created Date"
				field="createdAt"
				currentSortBy={sortBy}
				currentOrder={order}
			/>
			{/* Static Action column */}
			<div className="text-sm font-semibold px-2 py-1 text-gray-600 text-right">
				Action
			</div>
		</>
	)
}

export default SortControls
