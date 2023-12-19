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

export default function Home() {
	return (
		<main className="w-main">
			<div className="flex">
				<div className="w-[25%] flex flex-col gap-5 flex-auto">
					<Sidebar />
					<DailySale />
				</div>
				<div className="w-[75%] flex flex-col gap-5 flex-auto pl-5">
					<Banner />
					<Seller />
				</div>
			</div>
			<div className="my-8">
				<FeatureProducts />
			</div>
			<div className="my-8">
				<NewArrivals />
			</div>
			<div className="my-8">
				<HotCollections />
			</div>
			<div className="my-8">
				<Blog />
			</div>
		</main>
	)
}
