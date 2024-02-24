"use client"
import { FC, useCallback, useMemo, useState } from "react"
import { ProductType } from "@/types/product"
import { CustomSlider } from "@/components"
import clsx from "clsx"
import { ApiProductResponse } from "@/types"

interface NewArrivalsProps {
	fetchProducts: (params: {}) => Promise<ApiProductResponse<ProductType[]>>
	initialProducts: ProductType[] | []
}

const NewArrivals: FC<NewArrivalsProps> = ({
	fetchProducts,
	initialProducts,
}) => {
	const tabs = useMemo(
		() => [
			{ id: 1, name: "Smartphone", sort: "-sold" },
			{ id: 2, name: "Tablet", sort: "-createdAt" },
			{ id: 3, name: "Laptop", sort: "-createdAt" },
		],
		[]
	)

	const [products, setProducts] = useState<ProductType[] | null>(
		initialProducts
	)
	const [titleId, setTitleId] = useState(tabs[0].id)

	const fetchProductsComponent = useCallback(
		async (sort: {}, tabId: number) => {
			try {
				const response = await fetchProducts(sort)
				setProducts(response.data)
				setTitleId(tabId)
			} catch (error) {
				console.error("Error fetching products:", error)
			}
		},
		[fetchProducts]
	)

	const titleClass = (id: number) =>
		clsx(
			`rounded p-1 hover:bg-rose-500 hover-effect border-2`,
			titleId === id ? "border-rose-500" : "border-transparent"
		)

	return (
		<div className="w-full">
			<div className="flex flex-row items-center justify-center gap-2">
				<h2 className="font-semibold text-xl">New arrivals</h2>
				<div className="ml-auto flex gap-2 text-xs">
					{tabs.map((tab) => (
						<button
							onClick={() => fetchProductsComponent({ sort: tab.sort }, tab.id)}
							key={tab.id}
							className={titleClass(tab.id)}
						>
							{tab.name}
						</button>
					))}
				</div>
			</div>
			<CustomSlider products={products} />
		</div>
	)
}

export default NewArrivals
