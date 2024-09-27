"use client"
import { Dispatch, FC, SetStateAction } from "react"
import { CategoryType, Brand } from "@/types"
import { Button } from "@/components"
import { API } from "@/constant"

interface EditCategoryModalProps {
	showEditModal: boolean
	setShowEditModal: Dispatch<SetStateAction<boolean>>
	selectedCategory: any
	setSelectedCategory: Dispatch<SetStateAction<CategoryType | null>>
	selectedBrands: any
	setSelectedBrands: Dispatch<SetStateAction<Brand[]>>
	brands: Brand[]
}

const EditCategoryModal: FC<EditCategoryModalProps> = ({
	showEditModal,
	setShowEditModal,
	selectedCategory,
	setSelectedCategory,
	selectedBrands,
	setSelectedBrands,
	brands,
}) => {
	const closeModal = () => {
		setShowEditModal(false)
		setSelectedCategory(null)
		setSelectedBrands([])
	}

	const toggleBrandSelection = (brandId: string) => {
		setSelectedBrands((prevSelected) => {
			const isSelected = prevSelected.some((brand) => brand._id === brandId)
			if (isSelected) {
				return prevSelected.filter((brand) => brand._id !== brandId)
			} else {
				const selectedBrand = brands.find((brand) => brand._id === brandId)
				return selectedBrand ? [...prevSelected, selectedBrand] : prevSelected
			}
		})
	}

	const handleUpdateCategory = async () => {
		if (!selectedCategory) return
		const response = await fetch(
			API + `/product-category/${selectedCategory._id}`,
			{
				method: "PUT",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ brand: selectedBrands }),
			}
		)

		const result = await response.json()

		if (result.success) {
			alert("Category updated successfully!")
			closeModal()
		} else {
			alert("Failed to update category.")
		}
	}

	return (
		showEditModal && (
			<div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
				<div className="bg-white rounded-lg shadow-lg w-3/4 max-w-xl p-6">
					<h2 className="text-xl font-bold mb-4">
						Edit Category: {selectedCategory?.title}
					</h2>
					<div className="max-h-64 overflow-y-auto mb-4">
						{brands.map((brand) => (
							<div key={brand._id} className="flex items-center space-x-2">
								<input
									type="checkbox"
									checked={selectedBrands.some(
										(selectedBrand: Brand) => selectedBrand._id === brand._id
									)}
									onChange={() => toggleBrandSelection(brand._id)}
									name={brand.title}
									id={brand._id}
								/>
								<label htmlFor={brand._id}>{brand.title}</label>
							</div>
						))}
					</div>
					<div className="flex justify-end space-x-4">
						<Button
							onClick={handleUpdateCategory}
							className="bg-blue-500 text-white"
						>
							Update
						</Button>
						<Button onClick={closeModal} className="bg-gray-500 text-white">
							Cancel
						</Button>
					</div>
				</div>
			</div>
		)
	)
}

export default EditCategoryModal
