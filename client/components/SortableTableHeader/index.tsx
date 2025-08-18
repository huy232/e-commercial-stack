"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"

interface SortableTableHeaderProps<T extends string> {
	headers: { title: string; key: T; align?: "left" | "center" | "right" }[]
	sortableFields: T[] // Define which fields are sortable
}
const SortableTableHeader = <T extends string>({
	headers,
	sortableFields,
}: SortableTableHeaderProps<T>) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	// Get current sorting state from URL params
	const sortConfig = {
		key: (searchParams.get("sort") as T) || null,
		order: (searchParams.get("order") as "asc" | "desc") || null,
	}

	// Handle sorting logic
	const handleSort = (key: T) => {
		const currentSort = searchParams.get("sort")
		const currentOrder = searchParams.get("order")

		let newOrder: "asc" | "desc" | undefined

		if (currentSort === key) {
			if (currentOrder === "asc") {
				newOrder = "desc"
			} else if (currentOrder === "desc") {
				newOrder = undefined // Remove sorting
			} else {
				newOrder = "asc"
			}
		} else {
			newOrder = "asc" // Default to ascending if sorting a new column
		}

		// Construct new query params
		const params = new URLSearchParams(searchParams.toString())

		if (newOrder) {
			params.set("sort", key)
			params.set("order", newOrder)
		} else {
			params.delete("sort")
			params.delete("order")
		}

		// Update URL
		router.push(`${pathname}?${params.toString()}`)
	}

	// Get sorting icon
	const getSortIcon = (key: T) => {
		if (sortConfig.key !== key) return "↕"
		return sortConfig.order === "asc" ? "↑" : "↓"
	}

	return (
		<thead className="hidden lg:table-header-group font-semibold font-mono bg-gray-700 text-sm text-white">
			<tr>
				{headers.map(({ title, key, align = "left" }) => (
					<th
						key={key}
						className={clsx(
							"px-1 py-2 whitespace-nowrap",
							sortableFields.includes(key) && "cursor-pointer",
							align === "center" && "text-center",
							align === "right" && "text-right"
						)}
						onClick={() => sortableFields.includes(key) && handleSort(key)}
					>
						{title}
						{sortableFields.includes(key) && <span>{getSortIcon(key)}</span>}
					</th>
				))}
			</tr>
		</thead>
	)
}

export default SortableTableHeader
