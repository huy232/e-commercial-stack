"use client"
import { ApiProductResponse, ProductType } from "@/types"
import { FC, useState, useEffect } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import { FilterBar, InputSelect, Pagination, ProductCard } from "@/components"
import { useSearchParams } from "next/navigation"
import { colorsOptions } from "@/constant"
import { sortByOptions } from "@/constant/sortBy"
import { useFetchMaxPrice } from "@/hooks"

interface ProductsProps {
	fetchProducts: (params: {}) => Promise<ApiProductResponse<ProductType[]>>
	searchParams: { [key: string]: string | string[] | undefined }
}

const ProductList: FC<ProductsProps> = ({ fetchProducts, searchParams }) => {
	const [loading, setLoading] = useState(true)
	const [products, setProducts] = useState<ProductType[]>([])
	const maxPrice = useFetchMaxPrice({ fetchProducts })
	const [totalPage, setTotalPage] = useState(1)
	const params = useSearchParams() as URLSearchParams

	useEffect(() => {
		const getProductList = async () => {
			setLoading(true)
			await fetchProducts({ sort: "-sold", ...searchParams })
				.then((response) => {
					if (response) {
						setProducts(response.data)
						setTotalPage(response.totalPage)
					} else {
						setProducts([])
						setTotalPage(1)
					}
				})
				.catch((error) => {
					setProducts([])
					setTotalPage(1)
					console.error("Error fetching products:", error)
				})
				.finally(() => {
					setLoading(false)
				})
		}
		getProductList()
	}, [fetchProducts, params, searchParams])
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
			{!loading && (
				<div className="w-full">
					<ResponsiveMasonry
						columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
					>
						<Masonry className="gap-4">
							{products.map((product) => (
								<ProductCard key={product._id} product={product} />
							))}
						</Masonry>
					</ResponsiveMasonry>
					<Pagination totalPages={totalPage} />
				</div>
			)}
		</>
	)
}
export default ProductList
