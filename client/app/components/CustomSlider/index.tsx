"use client"
import Slider from "react-slick"
import { Product } from "@/app/components"
import { ProductType } from "@/types"
import { FC, useCallback, useEffect, useState } from "react"
import clsx from "clsx"

interface CustomSliderProps {
	tabs: { id: number; name: string; sort: string; markLabel?: string }[]
	products: { [key: number]: ProductType[] }
	fetchProducts: (tabId: number, sort: string) => Promise<void>
	initialActiveTab: number
	slideToShow?: number
	headingTitle?: string
	headingClassName?: string
	headingTabClassName?: string
	supportHover?: boolean
	supportDetail?: boolean
}

const CustomSlider: FC<CustomSliderProps> = ({
	tabs,
	products,
	fetchProducts,
	initialActiveTab,
	slideToShow,
	headingTitle,
	headingClassName,
	headingTabClassName,
	supportHover,
	supportDetail,
}) => {
	const slickSettings = {
		dots: false,
		infinite: true,
		speed: 500,
		slidesToShow: slideToShow || 3,
		slidesToScroll: 1,
	}

	const [activeTab, setActiveTab] = useState(initialActiveTab)
	const headingClass = clsx(
		"flex text-xl gap-8 border-b-2 border-main py-2 items-center",
		headingClassName
	)

	const headingTab = useCallback(
		(tabId: number) =>
			clsx(
				"font-bold capitalize border-r duration-200 ease-in-out cursor-pointer",
				{ "text-main": activeTab === tabId },
				{ "text-black opacity-20 hover:opacity-80": activeTab !== tabId },
				headingTabClassName
			),
		[activeTab, headingTabClassName]
	)

	const handleActiveTab = useCallback(
		async (tabId: number, sort: string) => {
			try {
				setActiveTab(tabId)
				await fetchProducts(tabId, sort)
			} catch (error) {
				console.error("Error fetching products:", error)
			}
		},
		[fetchProducts]
	)

	useEffect(() => {
		fetchProducts(tabs[0].id, tabs[0].sort)
	}, [fetchProducts, tabs])

	return (
		<div className="w-full">
			<div className={headingClass}>
				{headingTitle && (
					<h3 className="mr-auto uppercase text-lg font-semibold">
						{headingTitle}
					</h3>
				)}
				{tabs.length > 0 &&
					tabs.map((tab) => (
						<span
							onClick={() => handleActiveTab(tab.id, tab.sort)}
							className={headingTab(tab.id)}
							key={tab.id}
						>
							{tab.name}
						</span>
					))}
			</div>
			<Slider {...slickSettings} className="mt-4">
				{products[activeTab] &&
					products[activeTab].map((item: ProductType) => (
						<Product
							key={item._id}
							product={item}
							markLabel={tabs[activeTab - 1].markLabel}
							supportHover={supportHover}
							supportDetail={supportDetail}
						/>
					))}
			</Slider>
		</div>
	)
}

export default CustomSlider
