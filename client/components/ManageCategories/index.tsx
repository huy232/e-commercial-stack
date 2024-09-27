"use client"
import { FC, useState } from "react"
import { Brand, CategoryType } from "@/types"
import CategoryForm from "./CategoryForm"
import CategoryList from "./CategoryList"
import EditCategoryModal from "./EditCategoryModal"
import VariantForm from "./VariantForm"

interface ManageCategoryProps {
	brands: Brand[]
	categories: CategoryType[]
}

const ManageCategories: FC<ManageCategoryProps> = ({ brands, categories }) => {
	const [showEditModal, setShowEditModal] = useState(false)
	const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
		null
	)
	const [selectedBrands, setSelectedBrands] = useState<Brand[]>([])

	const handleEditCategory = (selectedCategory: CategoryType) => {
		const selectedBrandObjects = brands.filter((brand) =>
			selectedCategory.brand.some(
				(selectedBrand) => selectedBrand._id === brand._id
			)
		)
		setSelectedCategory(selectedCategory)
		setSelectedBrands(selectedBrandObjects)
		setShowEditModal(true)
	}

	return (
		<div>
			<CategoryForm />
			<VariantForm categories={categories} />
			<CategoryList brands={brands} handleEditCategory={handleEditCategory} />
			<EditCategoryModal
				showEditModal={showEditModal}
				setShowEditModal={setShowEditModal}
				selectedCategory={selectedCategory}
				setSelectedCategory={setSelectedCategory}
				selectedBrands={selectedBrands}
				setSelectedBrands={setSelectedBrands}
				brands={brands}
			/>
		</div>
	)
}

export default ManageCategories
