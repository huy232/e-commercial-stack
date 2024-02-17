"use client"
import { ProductType } from "@/types"
import { FC, useState, useEffect } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { FilterBar, InputSelect, ProductCard } from "@/components"
import { useSearchParams } from "next/navigation"
import { colorsOptions } from "@/constant"
import { sortByOptions } from "@/constant/sortBy"

interface ProductsProps {
	fetchProducts: (params: {}) => Promise<ProductType[]>
	searchParams: { [key: string]: string | string[] | undefined }
}

const ProductList: FC<ProductsProps> = ({ fetchProducts, searchParams }) => {
	const [loading, setLoading] = useState(true)
	const [products, setProducts] = useState<ProductType[]>([])
	const [maxPrice, setMaxPrice] = useState<number | null>(null)
	const params = useSearchParams() as URLSearchParams

	useEffect(() => {
		const getProductList = () => {
			fetchProducts({ sort: "-sold", ...searchParams })
				.then((response) => {
					if (response) {
						setProducts(response)
					} else {
						setProducts([])
					}
				})
				.catch((error) => {
					setProducts([])
					console.error("Error fetching products:", error)
				})
				.finally(() => {
					setLoading(false)
					console.log("Fetch products operation completed")
				})
		}
		getProductList()
	}, [fetchProducts, params, searchParams])

	useEffect(() => {
		const fetchMaxPrice = () => {
			fetchProducts({ sort: "-price", limit: 1 })
				.then((response) => {
					if (response) {
						setMaxPrice(response[0].price)
					}
				})
				.catch((error) => {
					console.error("Error fetching max price:", error)
				})
				.finally(() => {
					console.log("Fetch max price operation completed")
				})
		}

		fetchMaxPrice()
	}, [fetchProducts])

	return (
		<>
			<div className="w-main border p-4 flex justify-center items-center mx-auto">
				<div className="w-4/5 flex flex-col gap-3">
					<span className="font-semibold text-sm">Filter by</span>
					<div className="flex items-center gap-4">
						<FilterBar name="color" type="checkbox" options={colorsOptions} />
						<FilterBar name="price" type="input" maxPrice={maxPrice} />
					</div>
				</div>
				<div className="w-1/5 flex flex-col">
					<span>Sort by</span>
					<div className="w-full">
						<InputSelect options={sortByOptions} />
					</div>
				</div>
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
