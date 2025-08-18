"use client"
import SearchFilter from "@/components/SearchFilter"
import { FC } from "react"

const SearchProduct: FC = () => {
	return (
		<SearchFilter
			// title="Search Users"
			fields={[
				{
					label: "Type",
					name: "type",
					type: "select",
					options: [{ label: "Product name", value: "product_name" }],
				},
			]}
		/>
	)
}

export default SearchProduct
