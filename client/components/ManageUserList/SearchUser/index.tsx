"use client"
import SearchFilter from "@/components/SearchFilter"
import { FC } from "react"

const SearchUser: FC = () => {
	return (
		<SearchFilter
			// title="Search Users"
			fields={[
				{
					label: "Type",
					name: "type",
					type: "select",
					options: [{ label: "Email", value: "email" }],
				},
			]}
		/>
	)
}

export default SearchUser
