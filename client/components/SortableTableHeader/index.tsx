"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import clsx from "clsx"
import { ChevronUp, ChevronDown, ChevronsUpDown } from "lucide-react"
import { UserColumnKey, userTableColumns } from "@/constant"

interface SortableTableHeaderProps<T extends string> {
	headers: { title: string; key: T; align?: "left" | "center" | "right" }[]
	sortableFields: T[]
}

const SortableTableHeader = <T extends string>({
	headers,
	sortableFields,
}: SortableTableHeaderProps<T>) => {
	const router = useRouter()
	const pathname = usePathname()
	const searchParams = useSearchParams()

	const sortConfig = {
		key: (searchParams.get("sort") as T) || null,
		order: (searchParams.get("order") as "asc" | "desc") || null,
	}

	const handleSort = (key: T) => {
		const currentSort = searchParams.get("sort")
		const currentOrder = searchParams.get("order")

		let newOrder: "asc" | "desc" | undefined
		if (currentSort === key) {
			if (currentOrder === "asc") newOrder = "desc"
			else if (currentOrder === "desc") newOrder = undefined
			else newOrder = "asc"
		} else newOrder = "asc"

		const params = new URLSearchParams(searchParams.toString())
		if (newOrder) {
			params.set("sort", key)
			params.set("order", newOrder)
		} else {
			params.delete("sort")
			params.delete("order")
		}
		router.push(`${pathname}?${params.toString()}`)
	}

	const getSortIcon = (key: T) => {
		if (sortConfig.key !== key)
			return <ChevronsUpDown className="w-3.5 h-3.5 opacity-40" />
		return sortConfig.order === "asc" ? (
			<ChevronUp className="w-3.5 h-3.5 text-orange-500" />
		) : (
			<ChevronDown className="w-3.5 h-3.5 text-orange-500" />
		)
	}

	return (
		<thead className="hidden lg:table-header-group">
			<tr className="bg-gradient-to-r from-gray-800 to-gray-700 text-gray-100 text-xs uppercase tracking-wider shadow-sm">
				{headers.map(({ title, key, align = "left" }) => {
					const isSortable = sortableFields.includes(key)
					return (
						<th
							key={key}
							className={clsx(
								"px-1 py-2 whitespace-nowrap",
								sortableFields.includes(key) && "cursor-pointer",
								align === "center" && "text-center",
								align === "right" && "text-right",
								userTableColumns[key as UserColumnKey] || "w-auto"
							)}
							onClick={() => isSortable && handleSort(key)}
						>
							<div className="flex items-center gap-2">
								<span className="">{title}</span>
								<span className="">{isSortable && getSortIcon(key)}</span>
							</div>
						</th>
					)
				})}
			</tr>
		</thead>
	)
}

export default SortableTableHeader
