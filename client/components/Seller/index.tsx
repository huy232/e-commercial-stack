"use client"
import { FC, useMemo, useState, useCallback, useEffect } from "react"
import { CustomImage } from "@/components"
import { ProductType } from "@/types/product"
import { BannerLeft, BannerRight } from "@/assets/images"
import { CustomSlider } from "@/components"
import clsx from "clsx"
import { ApiProductResponse } from "@/types"

interface SellerProps {
	fetchProducts: (params: {}) => Promise<ApiProductResponse<ProductType[]>>
	initialProducts: ProductType[] | []
}

const Seller: FC<SellerProps> = ({ fetchProducts, initialProducts }) => {
	const tabs = useMemo(
		() => [
			{ id: 1, name: "Best sellers", sort: "-sold", markLabel: "Trending" },
			{ id: 2, name: "New arrivals", sort: "-createdAt", markLabel: "New" },
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
			`rounded border-rose-500 p-1 hover:bg-rose-500 hover-effect`,
			titleId === id && ""
		)

	return (
		<div className="w-full">
			<div className="flex flex-row gap-2">
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

			<CustomSlider products={products} supportHover={true} />
			<div className="w-full flex gap-4 mt-8">
				<div className="w-1/2">
					<CustomImage src={BannerLeft} alt="Banner left" fill />
				</div>
				<div className="w-1/2">
					<CustomImage src={BannerRight} alt="Banner right" fill />
				</div>
			</div>
		</div>
	)
}

export default Seller
