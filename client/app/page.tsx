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
import { GetServerSideProps } from "next"
import { getDailyDeal, getProductCategories, getProducts } from "@/app/api"
import { ProductCategory } from "@/types"
// const productCategories: ProductCategory[] = productCategoriesResponse.data
// const dailyDeal = await getDailyDeal()
// const featureProducts = await getProducts({
// 	limit: 9,
// 	page: 1,
// 	totalRatings: 5,
// })
// const newArrivals = await Promise.all(
// 	productCategories.map(async (category) => {
// 		const products = await getProducts({ sort: category.sort })
// 		return { categoryId: category.id, products }
// 	})
// )

export default async function Home() {
	const productCategories = await getProductCategories()

	return (
		<main className="w-main">
			<div className="flex">
				<div className="w-[25%] flex flex-col gap-5 flex-auto">
					<Sidebar categories={productCategories} />
					{/* <DailySale dailySale={dailyDeal} /> */}
				</div>
				{/* <div className="w-[75%] flex flex-col gap-5 flex-auto pl-5">
					<Banner />
					<Seller />
				</div> */}
			</div>
			{/* <div className="my-8">
				<FeatureProducts />
			</div>
			<div className="my-8">
				<NewArrivals />
			</div>
			<div className="my-8">
				<HotCollections categories={productCategories} />
			</div>
			<div className="my-8">
				<Blog />
			</div> */}
		</main>
	)
}
