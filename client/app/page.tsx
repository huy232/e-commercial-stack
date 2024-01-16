import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import {
	Banner,
	DailySale,
	FeatureProducts,
	NewArrivals,
	Seller,
	Sidebar,
	HotCollections,
	Blog,
} from "@/app/components"
import { getDailyDeal, getProductCategories, getProducts } from "@/app/api"

export default async function Home() {
	const productCategories = await getProductCategories()
	const dailyDeal = await getDailyDeal()
	const fetchProducts = async (tabId: number, sort: string) => {
		"use server"
		try {
			const response = await getProducts({ sort })
			return response.data
		} catch (error) {
			console.error("Error fetching products:", error)
			return []
		}
	}
	const featureProducts = await getProducts({
		limit: 9,
		page: 1,
		totalRatings: 5,
	})

	return (
		<main className="w-main">
			<div className="flex">
				<div className="w-[25%] flex flex-col gap-5 flex-auto">
					<Sidebar categories={productCategories} />
					<DailySale dailySale={dailyDeal} />
				</div>
				<div className="w-[75%] flex flex-col gap-5 flex-auto pl-5">
					<Banner />
					<Seller fetchProducts={fetchProducts} />
				</div>
			</div>
			<div className="my-8">
				<FeatureProducts featureProducts={featureProducts} />
			</div>
			<div className="my-8">
				<NewArrivals fetchProducts={fetchProducts} />
			</div>
			<div className="my-8">
				<HotCollections categories={productCategories} />
			</div>
			<div className="my-8">
				<Blog />
			</div>
		</main>
	)
}
