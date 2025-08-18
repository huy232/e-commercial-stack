"use client"
import { SearchFilter } from "@/components"
import { FC } from "react"

const SearchBlog: FC = () => {
	return (
		<SearchFilter
			fields={[
				{
					label: "Search by",
					name: "type",
					type: "select",
					options: [
						{ label: "Blog Title", value: "title" },
						{ label: "Author Username", value: "username" },
					],
				},
			]}
		/>
	)
}

export default SearchBlog
