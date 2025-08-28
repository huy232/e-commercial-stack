"use client"
import { FC, useMemo, useState, useCallback, useEffect } from "react"
import { Button } from "@/components"
import { ProductExtraType } from "@/types/product"
import { CustomSlider } from "@/components"
import clsx from "clsx"
import { API, WEB_URL } from "@/constant"

interface SellerProps {
	initialProducts: ProductExtraType[] | []
}

const Seller: FC<SellerProps> = ({ initialProducts }) => {
	const tabs = useMemo(
		() => [
			{ id: 1, name: "Best sellers", sort: "-sold", markLabel: "Trending" },
			{ id: 2, name: "New arrivals", sort: "-createdAt", markLabel: "New" },
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
					API + `/product/get-all-product?` + new URLSearchParams(sort),
					{ method: "GET", cache: "no-cache" }
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
			`rounded border-2 border-transparent p-1 hover:border-rose-500 hover-effect font-bebasNeue`,
			titleId === id && "bg-red-500"
		)

	return (
		<div className="flex flex-col my-2 sm:my-4">
			<div className="flex flex-row gap-2 mb-4 max-sm:mx-auto ml-2">
				{tabs.map((tab) => {
					const { id, name, sort } = tab
					return (
						<Button
							onClick={() => fetchProductsComponent({ sort: sort }, id)}
							key={id}
							className={titleClass(tab.id)}
						>
							{name}
						</Button>
					)
				})}
			</div>
			<CustomSlider products={products} supportHover />
		</div>
	)
}

export default Seller
