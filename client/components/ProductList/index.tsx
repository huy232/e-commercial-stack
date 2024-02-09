"use client"
import { ProductType } from "@/types"
import { FC, useState, useEffect, useCallback } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { FilterBar, ProductCard } from "@/components"

interface ProductsProps {
	fetchProducts: (params: {}) => Promise<ProductType[]>
}

const ProductList: FC<ProductsProps> = ({ fetchProducts }) => {
	const [loading, setLoading] = useState(true)
	const [products, setProducts] = useState<ProductType[]>([])
	const [activeClick, setActiveClick] = useState<string | null>(null)
	const handleFetchProducts = async () => {}

	useEffect(() => {
		const getProductList = () => {
			fetchProducts({})
				.then((response) => {
					setProducts(response)
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
	}, [fetchProducts])

	const handleActiveFilter = useCallback(
		(name: string | null) => {
			if (activeClick === name) {
				setActiveClick(null)
			} else {
				setActiveClick(name)
			}
		},
		[activeClick]
	)

	return (
		<>
			<div className="w-main border p-4 flex justify-center items-center mx-auto">
				<div className="w-4/5 flex-auto flex flex-col gap-3">
					<span className="font-semibold text-sm">Filter by</span>
					<div className="flex items-center gap-4">
						<FilterBar
							name="color"
							activeClick={activeClick}
							onActiveClick={handleActiveFilter}
						/>
						<FilterBar
							name="price"
							activeClick={activeClick}
							onActiveClick={handleActiveFilter}
						/>
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
