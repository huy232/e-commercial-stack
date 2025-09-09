"use client"
import { FC, useCallback, useMemo, useState } from "react"
import { ProductExtraType, ProductType } from "@/types/product"
import { Button, CustomSlider } from "@/components"
import clsx from "clsx"
import { ApiProductResponse } from "@/types"
import { API } from "@/constant"

interface NewArrivalsProps {
	initialProducts: ProductExtraType[] | []
}

const NewArrivals: FC<NewArrivalsProps> = ({ initialProducts }) => {
	const tabs = useMemo(
		() => [
			{ id: 1, name: "Smartphone", category: "Smartphone" },
			{ id: 2, name: "Tablet", category: "Tablet" },
			{ id: 3, name: "Speaker", category: "Speaker" },
		],
		[]
	)

	const [products, setProducts] = useState<ProductExtraType[] | null>(
		initialProducts
	)
	const [titleId, setTitleId] = useState(tabs[0].id)

	const fetchProductsComponent = useCallback(
		async (sort: {}, tabId: number) => {
			try {
				const response = await fetch(
					`/api/product/get-all-product?` + new URLSearchParams(sort),
					{ method: "GET" }
				)
				const data = await response.json()
				setProducts(data.data)
				setTitleId(tabId)
			} catch (error) {
				console.error("Error fetching products:", error)
			}
		},
		[]
	)

	const titleClass = (id: number) =>
		clsx(
			`rounded p-1 hover:bg-rose-500 hover-effect border-2 duration-300 transition-all`,
			titleId === id ? "border-rose-500" : "border-transparent"
		)

	return (
		<div className="w-full">
			<div className="flex flex-col items-center justify-center gap-2">
				<h2 className="uppercase text-2xl font-semibold mx-4 lg:text-3xl font-bebasNeue">
					Suggested section
				</h2>
				<div className="mx-auto md:ml-auto md:mr-0 flex gap-4 text-xs font-anton mb-2">
					{tabs.map((tab) => (
						<Button
							onClick={() =>
								fetchProductsComponent({ category: tab.category }, tab.id)
							}
							key={tab.id}
							className={titleClass(tab.id)}
							aria-label={`Show ${tab.name} products`}
							role="button"
							tabIndex={0}
							data-testid={`tab-button-${tab.id}`}
							id={`tab-button-${tab.id}`}
						>
							{tab.name}
						</Button>
					))}
				</div>
			</div>
			<CustomSlider products={products} supportHover supportDetail />
		</div>
	)
}

export default NewArrivals
