"use client"
import { FC, useCallback, useMemo, useState } from "react"
import { ProductType } from "@/types/product"
import { CustomSlider } from "@/app/components"
import { getProducts } from "@/app/api"

export const NewArrivals: FC = () => {
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

	const fetchProducts = useCallback(async (tabId: number, sort: string) => {
		try {
			const response = await getProducts({ sort })
			setProducts((prevProducts) => ({
				...prevProducts,
				[tabId]: response.data.products,
			}))
		} catch (error) {
			console.error("Error fetching products:", error)
		}
	}, [])

	return (
		<div className="w-full">
			<CustomSlider
				tabs={tabs}
				products={products}
				fetchProducts={fetchProducts}
				initialActiveTab={1}
				headingClassName="justify-end"
				headingTabClassName="text-xs"
				headingTitle="New arrivals"
			/>
		</div>
	)
}
