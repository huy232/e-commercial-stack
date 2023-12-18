"use client"
import { FC, useMemo, useState, useCallback } from "react"
import { CustomImage } from "@/app/components"
import { ProductType } from "@/types/product"
import { BannerLeft, BannerRight } from "@/assets/images"
import { CustomSlider } from "../CustomSlider"
import { getProducts } from "@/app/api"

export const Seller: FC = () => {
	const tabs = useMemo(
		() => [
			{ id: 1, name: "Best sellers", sort: "-sold", markLabel: "Trending" },
			{ id: 2, name: "New arrivals", sort: "-createdAt", markLabel: "New" },
		],
		[]
	)

	const [products, setProducts] = useState<{ [key: number]: ProductType[] }>({
		[1]: [],
		[2]: [],
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
				supportHover={true}
			/>
			<div className="w-full flex gap-4 mt-8">
				<div className="w-1/2">
					<CustomImage src={BannerLeft} alt="Banner left" />
				</div>
				<div className="w-1/2">
					<CustomImage src={BannerRight} alt="Banner right" />
				</div>
			</div>
		</div>
	)
}
