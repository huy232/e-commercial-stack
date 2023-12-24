"use client"
import { getProducts } from "@/app/api"
import { ProductType } from "@/types"
import { FC, useCallback, useEffect, useState } from "react"
import { CustomImage, ProductCard } from "@/app/components"
import {
	BottomBanner1,
	BottomBanner2,
	BottomBanner3,
	BottomBanner4,
} from "@/assets/images"

const FeatureProducts: FC = () => {
	const [products, setProducts] = useState<ProductType[] | null>(null)

	const fetchProducts = useCallback(async () => {
		try {
			const response = await getProducts({ limit: 9, page: 1, totalRatings: 5 })
			if (response.data.success) {
				setProducts(response.data.products)
			}
		} catch (error) {
			console.error("Error fetching feature products:", error)
		}
	}, [])

	useEffect(() => {
		fetchProducts()
	}, [fetchProducts])
	return (
		<div className="w-full">
			<h3 className="uppercase text-lg font-semibold py-[15px] border-b-2 border-main">
				Feature products
			</h3>
			<div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-14">
				{products ? (
					products.map((product) => (
						<ProductCard key={product._id} product={product} />
					))
				) : (
					<div>Loading...</div>
				)}
			</div>
			<div className="flex justify-center items-center mt-12 gap-4">
				<div className="w-1/2 h-full">
					<CustomImage src={BottomBanner1} alt="Bottom banner 1" />
				</div>
				<div className="w-1/4 flex flex-col justify-between gap-4">
					<div className="h-1/2">
						<CustomImage src={BottomBanner2} alt="Bottom banner 2" />
					</div>
					<div className="h-1/2">
						<CustomImage src={BottomBanner3} alt="Bottom banner 3" />
					</div>
				</div>
				<div className="w-1/4">
					<CustomImage src={BottomBanner4} alt="Bottom banner 4" />
				</div>
			</div>
		</div>
	)
}

export default FeatureProducts
