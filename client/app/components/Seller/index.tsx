"use client"

import { getProducts } from "@/app/api"
import clsx from "clsx"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import Slider from "react-slick"
import { CustomImage, Product } from "@/app/components"
import { ProductType } from "@/types/product"
import { BannerLeft, BannerRight } from "@/assets/images"

const slickSettings = {
	dots: false,
	infinite: true,
	speed: 500,
	slidesToShow: 3,
	slidestoScroll: 1,
}

interface ProductsState {
	[key: number]: ProductType[]
}

export const Seller: FC = () => {
	const tabs = useMemo(
		() => [
			{ id: 1, name: "Best sellers", sort: "-sold", markLabel: "Trending" },
			{ id: 2, name: "New arrivals", sort: "-createdAt", markLabel: "New" },
		],
		[]
	)

	const [activeTab, setActiveTab] = useState(1)
	const [products, setProducts] = useState<ProductsState>({
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

	const headingTab = (tabId: number) =>
		clsx(
			"font-bold capitalize border-r duration-200 ease-in-out cursor-pointer",
			{ "text-main": activeTab === tabId },
			{ "text-black opacity-20 hover:opacity-80": activeTab !== tabId }
		)

	const handleActiveTab = useCallback(
		(tabId: number, sort: string) => {
			setActiveTab(tabId)
			fetchProducts(tabId, sort)
		},
		[fetchProducts]
	)

	useEffect(() => {
		fetchProducts(tabs[0].id, tabs[0].sort)
	}, [fetchProducts, tabs])

	return (
		<div className="w-full">
			<div className="flex text-xl gap-8 border-b-2 border-main">
				{tabs.map((tab) => (
					<span
						onClick={() => handleActiveTab(tab.id, tab.sort)}
						className={headingTab(tab.id)}
						key={tab.id}
					>
						{tab.name}
					</span>
				))}
			</div>
			<div className="mt-4">
				<Slider {...slickSettings}>
					{products[activeTab].length > 0 &&
						products[activeTab].map((item: ProductType) => (
							<Product
								key={item._id}
								product={item}
								markLabel={tabs[activeTab - 1].markLabel}
							/>
						))}
				</Slider>
			</div>
			<div className="h-[140px] w-full flex gap-4 mt-8">
				<div className="w-1/2 relative">
					<CustomImage src={BannerLeft} alt="Banner left" />
				</div>
				<div className="w-1/2 relative">
					<CustomImage src={BannerRight} alt="Banner right" />
				</div>
			</div>
		</div>
	)
}
