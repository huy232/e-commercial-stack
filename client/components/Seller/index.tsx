"use client"
import { FC, useMemo, useState, useCallback } from "react"
import { CustomImage } from "@/components"
import { ProductType } from "@/types/product"
import { BannerLeft, BannerRight } from "@/assets/images"
import { CustomSlider } from "@/components"

interface SellerProps {
	fetchProducts: (tabId: number, sort: string) => Promise<ProductType[] | null>
}

const Seller: FC<SellerProps> = ({ fetchProducts }) => {
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

export default Seller
