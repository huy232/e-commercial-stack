"use client"
import { FC, useMemo, useState, useCallback, useEffect } from "react"
import { CustomImage } from "@/components"
import { ProductType } from "@/types/product"
import { BannerLeft, BannerRight } from "@/assets/images"
import { CustomSlider } from "@/components"

interface SellerProps {
	fetchProducts: (params: {}) => Promise<ProductType[] | null>
	initialProducts: ProductType[] | []
}

const Seller: FC<SellerProps> = ({ fetchProducts, initialProducts }) => {
	const [products, setProducts] = useState<ProductType[] | null>(
		initialProducts
	)

	const tabs = useMemo(
		() => [
			{ id: 1, name: "Best sellers", sort: "-sold", markLabel: "Trending" },
			{ id: 2, name: "New arrivals", sort: "-createdAt", markLabel: "New" },
		],
		[]
	)

	const fetchProductsComponent = useCallback(
		async (sort: string) => {
			try {
				const data = await fetchProducts(sort)
				setProducts(data)
			} catch (error) {
				console.error("Error fetching products:", error)
			}
		},
		[fetchProducts]
	)

	useEffect(() => {
		const getProducts = async () => {
			const data = await fetchProducts({
				sort: tabs[0].sort,
			})
			console.log(data)
		}

		getProducts()
	}, [fetchProducts, tabs])

	return (
		<div className="w-full">
			<CustomSlider products={products} supportHover={true} />
			<div className="w-full flex gap-4 mt-8">
				<div className="w-1/2">
					<CustomImage src={BannerLeft} alt="Banner left" />
				</div>
				<div className="w-1/2">
					<CustomImage src={BannerRight} alt="Banner right" />
				</div>
			</div>
		</div>
	)
}

export default Seller
