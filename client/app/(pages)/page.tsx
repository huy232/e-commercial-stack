import {
	Banner,
	DailySale,
	FeatureProducts,
	NewArrivals,
	Seller,
	Sidebar,
	HotCollections,
	Blog,
} from "@/components"
import { getDailyDeal, getProductCategories, getProducts } from "@/app/api"

export default async function Home() {
	const productCategories = await getProductCategories()
	const dailyDeal = await getDailyDeal()
	const fetchProducts = async (params: {}) => {
		"use server"
		try {
			const response = await getProducts(params)
			return response
		} catch (error) {
			console.error("Error fetching products:", error)
			return {
				success: false,
				data: [],
				counts: 0,
				totalPage: 0,
				currentPage: 0,
			}
		}
	}

	const { data: initialProducts } = await getProducts({ sort: "-sold" })
	const featureProducts = await getProducts({
		limit: 9,
		page: 1,
		sort: `-totalRatings`,
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
					<Seller
						fetchProducts={fetchProducts}
						initialProducts={initialProducts}
					/>
				</div>
			</div>
			<div className="my-8">
				<FeatureProducts featureProducts={featureProducts} />
			</div>
			<div className="my-8">
				<NewArrivals
					fetchProducts={fetchProducts}
					initialProducts={initialProducts}
				/>
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
