"use client"
import { ProductType } from "@/types"
import { FC, useState, useEffect, useCallback } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { FilterBar, ProductCard } from "@/components"
import { useSearchParams } from "next/navigation"

interface ProductsProps {
	fetchProducts: (params: {}) => Promise<ProductType[]>
	searchParams: { [key: string]: string | string[] | undefined }
}

const ProductList: FC<ProductsProps> = ({ fetchProducts, searchParams }) => {
	const [loading, setLoading] = useState(true)
	const [products, setProducts] = useState<ProductType[]>([])
	const params = useSearchParams() as URLSearchParams

	useEffect(() => {
		const getProductList = () => {
			fetchProducts(searchParams)
				.then((response) => {
					if (response) {
						setProducts(response)
					} else {
						setProducts([])
					}
				})
				.catch((error) => {
					console.error("Error fetching products:", error)
				})
				.finally(() => {
					setLoading(false)
					console.log("Fetch products operation completed")
				})
		}
		getProductList()
	}, [fetchProducts, params, searchParams])

	console.log(products)

	return (
		<>
			<div className="w-main border p-4 flex justify-center items-center mx-auto">
				<div className="w-4/5 flex-auto flex flex-col gap-3">
					<span className="font-semibold text-sm">Filter by</span>
					<div className="flex items-center gap-4">
						<FilterBar name="color" type="checkbox" />
						<FilterBar name="price" type="checkbox" />
					</div>
				</div>
				<div className="w-1/5">Sort by</div>
			</div>
			<div className="w-full">
				{!loading && (
					<ResponsiveMasonry
						columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
					>
						<Masonry className="gap-4">
							{products.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</Masonry>
					</ResponsiveMasonry>
				)}
			</div>
		</>
	)
}
export default ProductList
