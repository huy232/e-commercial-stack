"use client"
import { FC, useCallback, useEffect, useState } from "react"
import { Brand, CategoryType } from "@/types"
import { Button, Pagination } from "@/components"
import { useSearchParams } from "next/navigation"
import { API, BASE_SERVER_URL } from "@/constant"
import io, { Socket } from "socket.io-client"

interface CategoryListProps {
	brands: Brand[]
	handleEditCategory: (category: CategoryType) => void
}
let socket: Socket | null = null

const CategoryList: FC<CategoryListProps> = ({
	brands,
	handleEditCategory,
}) => {
	const searchParams = useSearchParams()

	const itemsPerPage = 10
	const [loading, setLoading] = useState(true)
	const [productCategories, setProductCategories] = useState<CategoryType[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [currentPage, setCurrentPage] = useState(1)
	const [selectedCategories, setSelectedCategories] = useState<string[]>([])

	const fetchCategoryList = useCallback(async () => {
		setLoading(true)
		const page = searchParams.has("page") ? searchParams.get("page") : "1"
		setCurrentPage(Number(page))

		const brandListResponse = await fetch(
			API + `/product-category?page=${page}&limit=${itemsPerPage}`,
			{
				method: "GET",
				credentials: "include",
			}
		)
		const productCategories = await brandListResponse.json()
		if (productCategories.success) {
			setProductCategories(productCategories.data)
			setTotalPages(productCategories.totalPages)
		}
		setLoading(false)
	}, [searchParams])
	const handleSelectCategory = (categoryId: string) => {
		setSelectedCategories((prevSelected) =>
			prevSelected.includes(categoryId)
				? prevSelected.filter((id) => id !== categoryId)
				: [...prevSelected, categoryId]
		)
	}

	const handleDeleteSelected = async () => {
		if (selectedCategories.length === 0) return

		const confirmDelete = window.confirm(
			`Are you sure you want to delete ${selectedCategories.length} categories?`
		)
		if (confirmDelete) {
			const deleteResponse = await fetch(
				API + "/product-category/bulk-delete",
				{
					method: "DELETE",
					body: JSON.stringify({ ids: selectedCategories }),
					credentials: "include",
					headers: { "Content-Type": "application/json" },
				}
			)
			const result = await deleteResponse.json()
			if (result.success) {
				setSelectedCategories([])
				alert("Categories deleted successfully.")
				fetchCategoryList()
			}
		}
	}

	const handleCancelSelection = () => {
		setSelectedCategories([])
	}

	const startIndex = (currentPage - 1) * itemsPerPage + 1

	useEffect(() => {
		fetchCategoryList()

		if (!socket) {
			socket = io(BASE_SERVER_URL as string, {
				withCredentials: true,
			})

			socket.on("categoryUpdate", async () => {
				await fetchCategoryList()
			})
		}

		return () => {
			if (socket) {
				socket.off("categoryUpdate")
				socket.disconnect()
				socket = null
			}
		}
	}, [fetchCategoryList, searchParams])

	if (loading) return <div>Loading...</div>

	if (!productCategories.length)
		return <div>There are currently no product categories.</div>

	return (
		<div>
			<h2 className="text-xl font-bold mb-4">Manage categories list</h2>
			<div>
				<table className="min-w-full table-auto">
					<thead>
						<tr>
							<th className="px-4 py-2">Select</th>
							<th className="px-4 py-2">#</th>
							<th className="px-4 py-2">Name</th>
							<th className="px-4 py-2">Brand(s)</th>
							<th className="px-4 py-2">Action(s)</th>
						</tr>
					</thead>
					<tbody>
						{productCategories.map((category, index) => (
							<tr key={category._id} className="border-b">
								<td className="px-4 py-2">
									<input
										type="checkbox"
										checked={selectedCategories.includes(category._id)}
										onChange={() => handleSelectCategory(category._id)}
									/>
								</td>
								<td className="px-4 py-2">{startIndex + index}</td>
								<td className="px-4 py-2">{category.title}</td>
								<td className="px-4 py-2">
									{category.brand && (
										<div className="overflow-y-auto whitespace-nowrap h-[90px] w-full">
											{category.brand.map((brand) => (
												<span key={brand._id} className="block">
													{brand.title}
												</span>
											))}
										</div>
									)}
								</td>
								<td className="px-4 py-2">
									<Button onClick={() => handleEditCategory(category)}>
										Edit
									</Button>
								</td>
							</tr>
						))}
					</tbody>
				</table>
				<div className="flex space-x-4 mt-4">
					<Button
						onClick={handleDeleteSelected}
						disabled={selectedCategories.length === 0}
					>
						Delete Selected
					</Button>
					<Button
						onClick={handleCancelSelection}
						disabled={selectedCategories.length === 0}
					>
						Cancel
					</Button>
				</div>
				<Pagination totalPages={totalPages} />
			</div>
		</div>
	)
}

export default CategoryList
