"use client"
import { ProductType } from "@/types"
import { FC, useCallback, useEffect, useState } from "react"
import { Pagination } from "@/components"
import { useSearchParams } from "next/navigation"
import SearchProduct from "./SearchProduct"
import ProductTableRow from "./ProductTableRow"
import { URL } from "@/constant"

const ManageProducts: FC = () => {
	const [productList, setProductList] = useState<ProductType[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(true)
	const [productListChanged, setProductListChanged] = useState(false)
	const params = useSearchParams() as URLSearchParams

	const fetchProducts = useCallback(async (params: any) => {
		setLoading(true)
		try {
			const fetchProductResponse = await fetch(
				URL + "/api/product?" + new URLSearchParams(params),
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
	}, [])

	useEffect(() => {
		const page = params.has("page") ? Number(params.get("page")) : 1
		const search = params.has("search") ? params.get("search") ?? "" : ""
		if (search !== "") {
			fetchProducts({ page, search, limit: 10 })
		} else {
			fetchProducts({ page, limit: 10 })
		}
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
