export const dynamic = "force-dynamic"
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
	CustomImage,
	BrandProduct,
	ProductCategory,
	SaleList,
} from "@/components"
import { API, WEB_URL } from "@/constant"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Digital World | Your One-Stop Tech Shop",
	description:
		"Explore the latest gadgets, smart devices, and premium electronics at unbeatable prices. Discover tech deals, product reviews, and new arrivals at Digital World — where innovation meets convenience.",
	keywords: [
		"electronics",
		"gadgets",
		"tech store",
		"smartphones",
		"laptops",
		"e-commerce",
		"online shop",
		"Digital World",
	],
}

export default async function Home() {
	const productCategoryAPI = await fetch(WEB_URL + `/api/product-category`, {
		method: "GET",
		cache: "no-cache",
		credentials: "include",
	})
	const saleListAPI = await fetch(WEB_URL + `/api/product/products-on-sale`, {
		method: "GET",
		cache: "no-cache",
		credentials: "include",
	})
	const dailyDealAPI = await fetch(WEB_URL + `/api/product/daily-product`, {
		method: "GET",
		cache: "no-cache",
		credentials: "include",
	})
	const brandAPI = await fetch(WEB_URL + `/api/product/product-brand`, {
		method: "GET",
		cache: "no-cache",
		credentials: "include",
	})

	const queryInitialProducts = new URLSearchParams({
		sort: "-sold",
	}).toString()
	const initialProductsAPI = await fetch(
		WEB_URL + `/api/product/get-all-product?${queryInitialProducts}`,
		{ method: "GET", cache: "no-cache" }
	)

	const querySuggestionProducts = new URLSearchParams({
		category: "smartphone",
	}).toString()

	const querySuggestionProductsAPI = await fetch(
		WEB_URL + `/api/product/get-all-product?${querySuggestionProducts}`,
		{ method: "GET", cache: "no-cache" }
	)

	const queryFeatureProducts = new URLSearchParams({
		limit: "10",
		page: "1",
		sort: "-totalRatings",
	}).toString()
	const featureProductsAPI = await fetch(
		WEB_URL + `/api/product/get-all-product?${queryFeatureProducts}`,
		{ method: "GET", cache: "no-cache" }
	)

	const productCategories = await productCategoryAPI.json()
	const saleList = await saleListAPI.json()
	const dailyDeal = await dailyDealAPI.json()
	const brandProduct = await brandAPI.json()
	const initialProducts = await initialProductsAPI.json()
	const suggestionProducts = await querySuggestionProductsAPI.json()
	const featureProducts = await featureProductsAPI.json()

	return (
		<main className="">
			<div className="flex flex-col">
				<div className="w-full flex flex-col-reverse lg:flex-row gap-4 flex-auto items-center">
					<Sidebar categories={productCategories.data} />
					<Banner />
				</div>
				<div>
					<Seller initialProducts={initialProducts.data} />
					<SaleList saleList={saleList} />
				</div>
				<div className="w-full flex flex-col md:flex-row gap-4 mt-2 items-center">
					<DailySale dailySale={dailyDeal} />
					<Promotion />
				</div>
				<div className="mt-8">
					<Introduce />
				</div>
				<div className="flex flex-col gap-4 flex-auto w-full">
					<BrandProduct brandProduct={brandProduct} />
				</div>
			</div>
			<div className="my-4">
				<FeatureProducts featureProducts={featureProducts.data} />
			</div>
			<div className="my-4">
				<NewArrivals initialProducts={suggestionProducts.data} />
			</div>
			<div className="my-4">
				<ProductCategory productCategory={productCategories.data} />
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
