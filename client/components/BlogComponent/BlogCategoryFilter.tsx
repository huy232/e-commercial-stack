"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

const categories = [
	{ label: "All", value: "" },
	{ label: "E-commercial", value: "e-commercial" },
	{ label: "Review", value: "review" },
	{ label: "Technology", value: "technology" },
]

const BlogCategoryFilter = () => {
	const router = useRouter()
	const searchParams = useSearchParams()
	const currentCategory = searchParams.get("category") || ""

	const [selected, setSelected] = useState(currentCategory)

	const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const newCategory = e.target.value
		setSelected(newCategory)

		const newParams = new URLSearchParams(searchParams.toString())
		if (newCategory) {
			newParams.set("category", newCategory)
		} else {
			newParams.delete("category")
		}
		newParams.set("page", "1") // Reset pagination if any

		router.push(`/blog?${newParams.toString()}`)
	}

	return (
		<div className="mb-4">
			<select
				value={selected}
				onChange={handleChange}
				className="border px-4 py-2 rounded text-sm"
			>
				{categories.map((cat) => (
					<option key={cat.value} value={cat.value}>
						{cat.label}
					</option>
				))}
			</select>
		</div>
	)
}

export default BlogCategoryFilter
