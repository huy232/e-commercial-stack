"use client"
import { getProducts } from "@/app/api"
import clsx from "clsx"
import { FC, useCallback, useEffect, useMemo, useState } from "react"
import Slider from "react-slick"
import { Product } from ".."
import { ProductType } from "@/types/product"

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

	const fetchProducts = async (tabId: number, sort: string) => {
		try {
			const response = await getProducts({ sort })
			setProducts((prevProducts) => ({
				...prevProducts,
				[tabId]: response.data.products,
			}))
		} catch (error) {
			console.error("Error fetching products:", error)
		}
	}

	const headingTab = (tabId: number) =>
		clsx(
			"font-bold capitalize border-r duration-200 ease-in-out cursor-pointer",
			{ "text-main": activeTab === tabId },
			{ "text-black opacity-20 hover:opacity-80": activeTab !== tabId }
		)

	const handleActiveTab = useCallback((tabId: number, sort: string) => {
		setActiveTab(tabId)
		fetchProducts(tabId, sort)
	}, [])

	useEffect(() => {
		fetchProducts(tabs[0].id, tabs[0].sort)
	}, [tabs])

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
					{products[activeTab].map((item: ProductType) => (
						<Product
							key={item._id}
							product={item}
							markLabel={tabs[activeTab - 1].markLabel}
						/>
					))}
				</Slider>
			</div>
		</div>
	)
}