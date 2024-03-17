"use client"
import { ProductType, Users } from "@/types"
import { FC, useEffect, useState } from "react"
import { Pagination, SearchUser, UserTableRow } from "@/components"
import { getProducts, getUsers } from "@/app/api"
import { useSearchParams } from "next/navigation"
import SearchProduct from "./SearchProduct"
import ProductTableRow from "./ProductTableRow"

const ManageProducts: FC = () => {
	const [productList, setProductList] = useState<ProductType[]>([])
	const [totalPage, setTotalPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [productListChanged, setProductListChanged] = useState(false)
	const params = useSearchParams() as URLSearchParams

	useEffect(() => {
		const fetchProducts = async (params: any) => {
			setLoading(true)
			try {
				const response = await getProducts(params)
				if (response.success) {
					setProductList(response.data)
					setTotalPage(response.totalPage)
				} else {
					setProductList([])
					setTotalPage(1)
				}
			} catch (error) {
				setProductList([])
				setTotalPage(1)
				console.error("Error fetching product list:", error)
			} finally {
				setLoading(false)
			}
		}

		const page = params.has("page") ? Number(params.get("page")) : 1
		const search = params.has("search") ? params.get("search") ?? "" : ""
		if (search !== "") {
			fetchProducts({ page, search, limit: 10 })
		} else {
			fetchProducts({ page, limit: 10 })
		}
	}, [params, productListChanged])

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
					<Pagination totalPages={totalPage} />
				</>
			)}
		</div>
	)
}

export default ManageProducts
