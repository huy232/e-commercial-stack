"use client"
import { ProductExtraType, ProductType } from "@/types"
import { FC, useCallback, useEffect, useState } from "react"
import { Pagination } from "@/components"
import { useSearchParams } from "next/navigation"
import SearchProduct from "./SearchProduct"
import ProductTableRow from "./ProductTableRow"
import { API } from "@/constant"

const ManageProducts: FC = () => {
	const [productList, setProductList] = useState<ProductExtraType[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(true)
	const [productListChanged, setProductListChanged] = useState(false)
	const params = useSearchParams()

	const fetchProducts = useCallback(async () => {
		setLoading(true)
		try {
			// Convert search params into an object dynamically
			const queryParams: Record<string, string> = {}
			params.forEach((value, key) => {
				queryParams[key] = value
			})

			// Ensure default pagination limit is set if not provided
			if (!queryParams.limit) {
				queryParams.limit = "10"
			}

			const queryString = new URLSearchParams(queryParams).toString()

			const fetchProductResponse = await fetch(
				`/api/product/get-all-product?${queryString}`,
				{ method: "GET" }
			)
			const data = await fetchProductResponse.json()
			setProductList(data.data)
			setTotalPages(data.totalPages)
		} catch (error) {
			setProductList([])
			setTotalPages(1)
			console.error("Error fetching product list:", error)
		} finally {
			setLoading(false)
		}
	}, [params])

	useEffect(() => {
		fetchProducts()
	}, [params, productListChanged, fetchProducts])

	const handleProductListChange = () => {
		setProductListChanged((prevState) => !prevState)
	}

	return (
		<div className="w-full p-4">
			{!loading && (
				<>
					<SearchProduct />
					<ProductTableRow
						productList={productList}
						onProductListChange={handleProductListChange}
					/>
					<Pagination totalPages={totalPages} />
				</>
			)}
		</div>
	)
}

export default ManageProducts
