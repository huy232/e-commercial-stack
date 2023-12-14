"use client"
import { getProducts } from "@/app/api"
import clsx from "clsx"
import { FC, useEffect, useState } from "react"
import Slider from "react-slick"
import { Product } from ".."
import { ProductType } from "@/types/product"
const tabs = [
	{ id: 1, name: "Best sellers" },
	{ id: 2, name: "New arrivals" },
]
const slickSettings = {
	dots: false,
	infinite: true,
	speed: 500,
	slidesToShow: 3,
	slidestoScroll: 1,
}

export const Seller: FC = () => {
	const [bestSeller, setBestSeller] = useState([])
	const [newProducts, setNewProducts] = useState([])
	const [activeTab, setActiveTab] = useState(1)

	const fetchProducts = async () => {
		try {
			const [bestSellerResponse, newProductsResponse] = await Promise.all([
				getProducts({ sort: "-sold" }),
				getProducts({ sort: "-createdAt" }),
			])

			setBestSeller(bestSellerResponse.data)
			setNewProducts(newProductsResponse.data)
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
	const handleActiveTab = (tabId: number) => {
		setActiveTab(tabId)
	}

	useEffect(() => {
		fetchProducts()
	}, [])

	console.log(bestSeller)
	return (
		<div className="w-full">
			<div className="flex text-xl gap-8 border-b-2 border-main">
				{tabs.map((tab) => (
					<span
						onClick={() => handleActiveTab(tab.id)}
						className={headingTab(tab.id)}
						key={tab.id}
					>
						{tab.name}
					</span>
				))}
			</div>
			<div className="mt-4">
				<Slider {...slickSettings}>
					{bestSeller.length > 0 &&
						bestSeller.map((item: ProductType) => (
							<Product key={item._id} product={item} />
						))}
				</Slider>
			</div>
		</div>
	)
}
