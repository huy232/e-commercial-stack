"use client"
import { Dispatch, FC, SetStateAction, useEffect, useState } from "react"
import { CategoryType, Brand } from "@/types"
import { Button, Checkbox, CustomImage } from "@/components"
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
	const [previewUrl, setPreviewUrl] = useState<string | null>(
		selectedCategory?.image || null
	)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)
	const [uploading, setUploading] = useState(false)
	const [deleteOldImage, setDeleteOldImage] = useState(false)

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

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setSelectedFile(file)
			setPreviewUrl(URL.createObjectURL(file))
			if (selectedCategory?.image) {
				setDeleteOldImage(true) // mark for deletion later
			}
		}
	}

	const removeImage = () => {
		setSelectedFile(null)
		setPreviewUrl(null)
		setDeleteOldImage(false)
	}

	const handleUpdateCategory = async () => {
		if (!selectedCategory) return

		let imageUrl = selectedCategory.image || ""

		if (selectedFile) {
			const formData = new FormData()
			formData.append("image", selectedFile)
			setUploading(true)
			const imageRes = await fetch(`${API}/upload-image/single-image`, {
				method: "POST",
				credentials: "include",
				body: formData,
			})
			const imageData = await imageRes.json()
			setUploading(false)

			if (imageData.success) {
				imageUrl = imageData.image

				// Delete old image if it exists
				if (deleteOldImage && selectedCategory.image) {
					await fetch(`${API}/upload-image/delete`, {
						method: "POST",
						credentials: "include",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({ imageUrls: [selectedCategory.image] }),
					})
				}
			} else {
				alert("Failed to upload new image")
				return
			}
		}

		const response = await fetch(
			`${API}/product-category/${selectedCategory._id}`,
			{
				method: "PUT",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					brand: selectedBrands,
					image: imageUrl,
				}),
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

	useEffect(() => {
		if (!selectedCategory) return

		setPreviewUrl(selectedCategory.image || null)
		setSelectedFile(null)
		setDeleteOldImage(false)

		if (showEditModal && selectedCategory.brand) {
			setSelectedBrands(selectedCategory.brand)
		}
	}, [selectedCategory, showEditModal, setSelectedBrands])

	return (
		showEditModal && (
			<div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
				<div className="bg-white rounded-lg shadow-lg w-full lg:w-3/4 max-w-xl p-2 lg:p-6">
					<h2 className="text-base lg:text-xl font-bold mb-4 font-bebasNeue">
						Edit category: {selectedCategory?.title}
					</h2>
					<div>
						<span className="font-semibold font-xl my-2">Available Image:</span>

						{previewUrl && (
							<div className="relative border p-2 w-fit">
								<CustomImage
									src={previewUrl}
									alt="Preview"
									className="w-[220px] h-[220px] object-contain mx-auto"
									fill
								/>
								<button
									type="button"
									onClick={removeImage}
									className="absolute top-1 right-1 text-xs px-2 py-1 bg-white text-red-600 border border-red-600 rounded hover:bg-red-600 hover:text-white duration-300 ease-in-out"
									disabled={uploading}
									title="Remove image"
									aria-label="Remove image"
								>
									Remove
								</button>
							</div>
						)}
						<div>
							<label
								htmlFor="imageUploadEdit"
								className="cursor-pointer bg-rose-50 text-rose-700 px-4 py-2 text-sm font-semibold rounded hover:bg-rose-200 hover:text-rose-800 transition-all duration-300 ease-in-out inline-block"
							>
								{previewUrl ? "Replace image" : "Upload image"}
							</label>
							<input
								id="imageUploadEdit"
								type="file"
								accept="image/*"
								onChange={handleImageChange}
								className="hidden"
							/>
						</div>
					</div>
					<div className="max-h-64 overflow-y-auto mb-4">
						<span className="font-semibold my-1">Brand available:</span>
						{brands.map((brand) => (
							<div
								key={brand._id}
								className="flex flex-wrap gap-2 items-center"
							>
								<Checkbox
									// type="checkbox"
									checked={selectedBrands.some(
										(selectedBrand: Brand) => selectedBrand._id === brand._id
									)}
									onChange={() => toggleBrandSelection(brand._id)}
									name={brand.title}
									id={brand._id}
									// className="cursor-pointer"
								/>
								<label className="cursor-pointer" htmlFor={brand._id}>
									{brand.title}
								</label>
							</div>
						))}
					</div>
					<div className="flex justify-end space-x-4">
						<Button
							onClick={handleUpdateCategory}
							className="bg-blue-500 text-white rounded p-1 hover:opacity-80 duration-300 ease-in-out"
						>
							Update
						</Button>
						<Button
							onClick={closeModal}
							className="bg-red-500 text-white rounded p-1 hover:opacity-80 duration-300 ease-in-out"
						>
							Cancel
						</Button>
					</div>
				</div>
			</div>
		)
	)
}

export default EditCategoryModal
