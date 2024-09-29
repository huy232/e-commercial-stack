"use client"
import {
	ApiProductResponse,
	CategoryType,
	ProductExtraType,
	ProductType,
} from "@/types"
import { FC, useState, useEffect } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import {
	FilterBar,
	InputSelect,
	Pagination,
	ProductCard,
	SearchBar,
} from "@/components"
import { useSearchParams, useRouter } from "next/navigation"
import { filterCategory } from "@/constant"
import { sortByOptions } from "@/constant/sortBy"
import { useFetchMaxPrice } from "@/hooks"

interface ProductsProps {
	// fetchProducts: (params: {}) => Promise<ApiProductResponse<ProductType[]>>
	searchParams: { [key: string]: string | string[] | undefined }
	products: ProductExtraType[]
	categories: CategoryType[]
}

const ProductList: FC<ProductsProps> = ({
	searchParams,
	products,
	categories,
}) => {
	const [loading, setLoading] = useState(true)
	// const [products, setProducts] = useState<ProductType[]>([])
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
	const [selectedFilters, setSelectedFilters] = useState<any>({})
	// const maxPrice = useFetchMaxPrice({ fetchProducts })
	const [totalPages, setTotalPages] = useState(1)
	const params = useSearchParams() as URLSearchParams

	// useEffect(() => {
	// 	const getProductList = async () => {
	// 		setLoading(true)
	// 		await fetchProducts({
	// 			sort: "-sold",
	// 			...searchParams,
	// 		})
	// 			.then((response) => {
	// 				if (response) {
	// 					setProducts(response.data)
	// 					setTotalPages(response.totalPages)
	// 				} else {
	// 					setProducts([])
	// 					setTotalPages(1)
	// 				}
	// 			})
	// 			.catch((error) => {
	// 				setProducts([])
	// 				setTotalPages(1)
	// 				console.error("Error fetching products:", error)
	// 			})
	// 			.finally(() => {
	// 				setLoading(false)
	// 			})
	// 	}
	// 	getProductList()
	// }, [fetchProducts, searchParams, selectedFilters, params])

	const handleCategoryChange = (category: string) => {
		setSelectedCategory(category)
		setSelectedFilters({}) // Reset filters when category changes
	}

	const handleFilterChange = (
		filterType: string,
		selectedValues: string[] | string
	) => {
		setSelectedFilters((prevFilters: any) => ({
			...prevFilters,
			[filterType]: selectedValues,
		}))
	}

	const currentCategoryOptions =
		filterCategory.find((cat) => cat.category === selectedCategory)?.options ||
		[]

	return (
		<>
			<div className="w-main border p-4 flex justify-center items-center mx-auto">
				<div className="w-4/5 flex flex-col gap-3">
					<SearchBar />
					<span className="font-semibold text-sm">Filter by</span>
					<div className="flex items-center gap-4">
						{/* Category Filter (Radio button) */}
						<FilterBar
							name="Category"
							type="radio"
							options={{
								paramName: "category",
								values: filterCategory.map((cat) => cat.category),
							}}
							onChange={(selectedValues) => {
								if (typeof selectedValues === "string") {
									handleCategoryChange(selectedValues) // Ensure it matches handleCategoryChange
								}
							}} // Pass a handler for radio button
							selectedValue={selectedCategory || ""} // Ensure it is passed correctly
						/>

						{/* Dynamic Filters for Selected Category */}
						{selectedCategory &&
							currentCategoryOptions.map((option) => (
								<FilterBar
									key={option.type}
									name={option.type}
									type="checkbox"
									options={{
										paramName: option.type,
										values: option.value,
									}}
									onChange={
										(selectedValues) =>
											handleFilterChange(option.type, selectedValues) // Pass handler for checkbox
									}
									selectedValue={selectedFilters[option.type] || []}
								/>
							))}

						{/* Price Filter */}
						{/* <FilterBar name="price" type="input" maxPrice={maxPrice} /> */}
					</div>
				</div>
				<div className="w-1/5 flex flex-col">
					<span>Sort by</span>
					<div className="w-full">
						<InputSelect options={sortByOptions} />
					</div>
				</div>
			</div>
			{products && (
				<div className="w-full">
					<ResponsiveMasonry
						columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}
					>
						<Masonry className="gap-4">
							{products.map((product) => (
								<ProductCard
									key={product._id}
									product={product}
									enableOptions
								/>
							))}
						</Masonry>
					</ResponsiveMasonry>
					<Pagination totalPages={totalPages} />
				</div>
			)}
		</>
	)
}

export default ProductList
