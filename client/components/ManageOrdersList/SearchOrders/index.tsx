"use client"
import { SearchFilter } from "@/components"
import { FC } from "react"

const SearchOrders: FC = () => {
	return (
		<SearchFilter
			fields={[
				{
					label: "Type",
					name: "type",
					type: "select",
					options: [
						{ label: "Order ID", value: "order_id" },
						{ label: "User ID", value: "user_id" },
					],
				},
			]}
		/>
	)
}

export default SearchOrders
