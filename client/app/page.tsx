"use client"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import {
	Banner,
	DailySale,
	FeatureProducts,
	Seller,
	Sidebar,
} from "@/app/components"
import { AppDispatch } from "@/types/redux"
import { getCategoriesAction } from "@/store/actions/asyncAction"
import { useEffect } from "react"
import { useDispatch } from "react-redux"

export default function Home() {
	const dispatch = useDispatch<AppDispatch>()
	useEffect(() => {
		dispatch(getCategoriesAction())
	}, [dispatch])
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
		</main>
	)
}
