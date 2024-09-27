import {
	Banner,
	DailySale,
	FeatureProducts,
	NewArrivals,
	Seller,
	Sidebar,
	HotCollections,
	Blog,
	Introduce,
	Brand,
	Social,
	Promotion,
} from "@/components"
import { URL } from "@/constant"

export default async function Home() {
	const productCategoryAPI = await fetch(URL + `/api/category`, {
		method: "GET",
		cache: "no-cache",
	})
	const dailyDealAPI = await fetch(URL + `/api/product/daily-deal`, {
		method: "GET",
		cache: "no-cache",
	})
	const initialProductsAPI = await fetch(
		URL + `/api/product?` + new URLSearchParams({ sort: "-sold" }),
		{ method: "GET", cache: "no-cache" }
	)
	const featureProductsAPI = await fetch(
		URL +
			`/api/product?` +
			new URLSearchParams({
				limit: "9",
				page: "1",
				sort: `-totalRatings`,
			}),
		{ method: "GET", cache: "no-cache" }
	)

	const productCategories = await productCategoryAPI.json()
	const dailyDeal = await dailyDealAPI.json()
	const initialProducts = await initialProductsAPI.json()
	const featureProducts = await featureProductsAPI.json()

	return (
		<main className="w-main">
			<div className="flex">
				<div className="w-[25%] flex flex-col gap-5 flex-auto">
					<Sidebar categories={productCategories} />
					<DailySale dailySale={dailyDeal} />
				</div>
				<div className="w-[75%] flex flex-col gap-5 flex-auto pl-5">
					<Banner />
					<Seller initialProducts={initialProducts.data} />
				</div>
			</div>
			<Introduce />
			<div className="my-8">
				<FeatureProducts featureProducts={featureProducts.data} />
				<Promotion />
			</div>
			<div className="my-8">
				<NewArrivals initialProducts={initialProducts.data} />
			</div>
			<div className="my-8">
				<HotCollections categories={productCategories} />
			</div>
			<div className="my-8">
				<Brand />
			</div>
			<div className="my-8">
				<Social />
			</div>
		</main>
	)
}
