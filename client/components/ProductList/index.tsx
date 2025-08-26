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
import { useSearchParams, useRouter, usePathname } from "next/navigation"
import { filterCategory } from "@/constant"
import { sortByOptions } from "@/constant/sortBy"
import { useFetchMaxPrice } from "@/hooks"
import { FaRegSquareMinus, FaRegSquarePlus } from "@/assets/icons"
import clsx from "clsx"

interface ProductsProps {
	// fetchProducts: (params: {}) => Promise<ApiProductResponse<ProductType[]>>
	searchParams: { [key: string]: string | string[] | undefined }
	products: ProductExtraType[]
	categories: CategoryType[]
	totalPages?: number
}

const ProductList: FC<ProductsProps> = ({
	searchParams,
	products,
	categories,
	totalPages = 1,
}) => {
	const params = useSearchParams() as URLSearchParams
	const pathname = usePathname()
	const router = useRouter()
	const categoryParam = params.get("category")
	const initialCategory =
		typeof categoryParam === "string" ? categoryParam : null

	const [selectedCategory, setSelectedCategory] = useState(initialCategory)
	const [enableFilter, setEnableFilter] = useState(false)

	const currentCategoryOptions = selectedCategory
		? categories.find((cat) => cat.title === selectedCategory)?.option || []
		: []

	useEffect(() => {
		const category = params.get("category")
		setSelectedCategory(category ?? null)
	}, [params, pathname])

	return (
		<>
			<div className="w-full xl:w-main border p-4 flex justify-center items-center mx-auto flex-col">
				<div className="w-full relative mx-1 md:mx-2 lg:mx-4">
					<SearchBar />
				</div>
				<div className="w-full bg-[#242424] rounded mt-2 mx-1 md:mx-2 lg:mx-4">
					<button
						onClick={() => {
							setEnableFilter(!enableFilter)
						}}
						className={clsx(
							"py-3 text-white w-full flex items-center justify-between hover:opacity-80 hover-effect transition-all shadow-md hover:shadow-lg disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
						)}
						type="button"
					>
						<span className="mx-2 font-bold">Filters</span>
						{enableFilter ? (
							<FaRegSquareMinus className="mx-2" />
						) : (
							<FaRegSquarePlus className="mx-2" />
						)}
					</button>
					<div
						className={clsx(
							"items-center transition-all group-focus:visible group-focus:opacity-100 group-focus:duration-3000 mx-2 overflow-hidden",
							enableFilter
								? "max-h-max border-t-2 border-[#333333]"
								: "invisible h-0 max-h-0 border-transparent border-t-2 opacity-0"
						)}
					>
						<span className="font-semibold text-base text-white">
							Filter by
						</span>
						<div className="flex gap-4 flex-col">
							{/* Category Filter (Radio button) */}
							<FilterBar
								name="Category"
								type="radio"
								options={{
									paramName: "category",
									values: categories.map((cat) => cat.title),
								}}
							/>
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
									/>
								))}

							{/* Price Filter */}
							{/* <FilterBar name="price" type="input" maxPrice={maxPrice} /> */}
						</div>
						<div className="flex flex-col gap-2">
							<span className="font-semibold text-base text-white">
								Sort by
							</span>
							<InputSelect options={sortByOptions} />
						</div>
					</div>
				</div>
			</div>
			{products && (
				<>
					<div className="gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 justify-items-center">
						{products.map((product) => (
							<ProductCard key={product._id} product={product} enableOptions />
						))}
					</div>
					<Pagination totalPages={totalPages} />
				</>
			)}
		</>
	)
}

export default ProductList
