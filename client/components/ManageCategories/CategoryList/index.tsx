"use client"
import { FC, useCallback, useEffect, useState } from "react"
import { Brand, CategoryType } from "@/types"
import { Button, Checkbox, Modal, Pagination, showToast } from "@/components"
import { useSearchParams } from "next/navigation"
import { API, BASE_SERVER_URL } from "@/constant"
import io, { Socket } from "socket.io-client"
import { FaTrashAlt, IoMdCloseCircle, IoMdSettings } from "@/assets/icons"
import clsx from "clsx"

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
	const [showModal, setShowModal] = useState(false)
	const [categoryToDelete, setCategoryToDelete] = useState<CategoryType | null>(
		null
	)

	const fetchCategoryList = useCallback(async () => {
		setLoading(true)
		const page = searchParams.has("page") ? searchParams.get("page") : "1"
		setCurrentPage(Number(page))

		const brandListResponse = await fetch(
			`/api/product-category?page=${page}&limit=${itemsPerPage}`,
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
			const deleteResponse = await fetch("/api/product-category/bulk-delete", {
				method: "DELETE",
				body: JSON.stringify({ categoryIds: selectedCategories }),
				credentials: "include",
				headers: { "Content-Type": "application/json" },
			})
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

	const handleOpenDeleteModal = (category: CategoryType) => {
		setCategoryToDelete(category)
		setShowModal(true)
	}

	const handleConfirmDelete = async () => {
		if (!categoryToDelete) return

		try {
			if (categoryToDelete.image) {
				await fetch(API + "/upload-image/delete", {
					method: "POST",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({
						imageUrls: [categoryToDelete.image],
					}),
				})
			}

			const response = await fetch(
				`/api/product-category/${categoryToDelete._id}`,
				{
					method: "DELETE",
					credentials: "include",
				}
			)
			const result = await response.json()

			if (result.success) {
				showToast("Category deleted successfully.", "success")
				await fetchCategoryList()
			} else {
				showToast(result.message || "Failed to delete category.", "error")
			}
		} catch (err) {
			console.error(err)
			showToast("Something went wrong while deleting.", "error")
		} finally {
			setShowModal(false)
			setCategoryToDelete(null)
		}
	}

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
		<>
			<h2 className="text-2xl font-bold mb-4 font-bebasNeue text-center mt-4">
				Categories list
			</h2>
			<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
				<div className="max-w-xs text-center">
					<h2 className="text-lg font-semibold mb-2">Delete Category</h2>
					<p className="text-sm mb-4">
						<div className="flex flex-col items-center">
							<span className="">Are you sure you want to delete</span>
							<strong>{categoryToDelete?.title}</strong>?<br />
						</div>
						<span className="text-red-500 font-semibold">
							This action cannot be undone.
						</span>
					</p>
					<div className="flex justify-end gap-2">
						<Button
							onClick={() => setShowModal(false)}
							className="bg-gray-300 text-black px-4 py-2 rounded hover:opacity-80"
							aria-label="Cancel category deletion"
							role="button"
							tabIndex={0}
							data-testid="cancel-delete-category-button"
							id="cancel-delete-category-button"
						>
							Cancel
						</Button>
						<Button
							onClick={handleConfirmDelete}
							className="bg-red-500 text-white px-4 py-2 rounded hover:opacity-80"
							aria-label="Confirm category deletion"
							role="button"
							tabIndex={0}
							data-testid="confirm-delete-category-button"
							id="confirm-delete-category-button"
						>
							Delete
						</Button>
					</div>
				</div>
			</Modal>
			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mx-2">
				{productCategories.map((category, index) => (
					<div
						key={category._id}
						className={clsx(
							"relative lg:w-full opacity-80 rounded p-2 lg:m-2 h-fit mx-2 lg:mx-auto mt-2",
							selectedCategories.includes(category._id)
								? "bg-green-400/80"
								: "bg-black/30"
						)}
					>
						{/* Trash button */}
						<Button
							onClick={() => handleOpenDeleteModal(category)}
							className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:opacity-80 hover:brightness-110 duration-300 ease-in-out flex items-center justify-center"
							title="Delete category"
							aria-label="Delete category"
							disabled={selectedCategories.includes(category._id)}
						>
							<FaTrashAlt />
						</Button>

						<div className="mx-2 flex items-center gap-1 justify-between">
							<div className="bg-black/30 rounded p-1 flex items-center hover:opacity-80 hover:brightness-125 duration-300 ease-in-out mx-1">
								<Checkbox
									checked={selectedCategories.includes(category._id)}
									onChange={() => handleSelectCategory(category._id)}
									name={`product-category-${category._id}`}
									size={4}
								/>
								<label
									htmlFor={`product-category-${category._id}`}
									className="ml-1 cursor-pointer font-inter text-base font-semibold select-none"
								>
									{category.title}
								</label>
							</div>
							<Button
								onClick={() => handleEditCategory(category)}
								className="mx-2 group duration-300 transition-all hover:opacity-80 hover:brightness-110 bg-black/30 rounded p-1 flex flex-row items-center ease-in-out"
								title="Edit category"
							>
								<span className="mr-0.5">Edit</span>
								<IoMdSettings size={20} className="group-hover:animate-spin" />
							</Button>
						</div>

						<span className="font-medium mx-3 text-sm mt-2">
							Brand available
						</span>
						{category.brand ? (
							<ul className="mx-2 px-2 py-1 flex flex-wrap gap-2 mt-1">
								{category.brand.map((brand) => (
									<li
										key={brand._id}
										className="text-xs bg-zinc-800 text-gray-300 p-1 rounded select-none font-light"
									>
										{brand.title}
									</li>
								))}
							</ul>
						) : (
							<span className="italic text-red-500/80 font-semibold">
								No brand available
							</span>
						)}
					</div>
				))}
			</div>
			{selectedCategories.length > 0 && (
				<div className="flex mt-4 items-center justify-end mx-2 gap-2">
					<Button
						onClick={handleDeleteSelected}
						disabled={selectedCategories.length === 0}
						className={clsx(
							"bg-green-500/80 rounded p-1 hover:opacity-80 hover:brightness-125 duration-300 ease-in-out border-2 border-transparent hover:bg-transparent hover:border-green-bg-green-500/80"
						)}
						aria-label="Delete selected categories"
						role="button"
						tabIndex={0}
						data-testid="delete-selected-categories-button"
						id="delete-selected-categories-button"
					>
						Delete Selected
					</Button>
					<Button
						onClick={handleCancelSelection}
						disabled={selectedCategories.length === 0}
						className="bg-rose-500 rounded p-1 hover:opacity-80 hover:brightness-125 duration-300 ease-in-out border-2 border-transparent hover:bg-transparent hover:border-rose-500"
						aria-label="Cancel category selection"
						role="button"
						tabIndex={0}
						data-testid="cancel-selection-button"
						id="cancel-selection-button"
					>
						Cancel
					</Button>
				</div>
			)}
			<Pagination totalPages={totalPages} />
		</>
	)
}

export default CategoryList
