"use client"
import { FC, useCallback, useMemo, useState } from "react"
import { ProductType } from "@/types/product"
import { CustomSlider } from "@/components"

interface NewArrivalsProps {
	fetchProducts: any
}

const NewArrivals: FC<NewArrivalsProps> = ({ fetchProducts }) => {
	const tabs = useMemo(
		() => [
			{ id: 1, name: "Smartphone", sort: "-sold" },
			{ id: 2, name: "Tablet", sort: "-createdAt" },
			{ id: 3, name: "Laptop", sort: "-createdAt" },
		],
		[]
	)

	const [products, setProducts] = useState<{ [key: number]: ProductType[] }>({
		[1]: [],
		[2]: [],
		[3]: [],
	})

	const fetchProductsComponent = useCallback(
		async (tabId: number, sort: string) => {
			try {
				const data = await fetchProducts(tabId, sort)
				setProducts((prevProducts) => ({
					...prevProducts,
					[tabId]: data || [],
				}))
			} catch (error) {
				console.error("Error fetching products:", error)
			}
		},
		[fetchProducts]
	)

	return (
		<div className="w-full">
			<CustomSlider
				tabs={tabs}
				products={products}
				fetchProducts={fetchProductsComponent}
				initialActiveTab={1}
				headingClassName="justify-end"
				headingTabClassName="text-xs"
				headingTitle="New arrivals"
			/>
		</div>
	)
}

export default NewArrivals
