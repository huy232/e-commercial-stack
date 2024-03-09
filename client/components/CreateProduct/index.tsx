"use client"
import { FieldValues, useForm } from "react-hook-form"
import {
	BrandSelect,
	Button,
	ImagePreview,
	ImageUpload,
	InputField,
	Select,
} from "@/components"
import { FC, useState } from "react"
import { CreateProductType, ProductCategoryType } from "@/types"
import dynamic from "next/dynamic"
import { createProduct } from "@/app/api"

const DynamicReactQuill = dynamic(() => import("react-quill"), { ssr: false })

interface CreateProductProps {
	categories: ProductCategoryType[]
}

interface ProductFormData extends FieldValues {
	productName: string
	price: string
	quantity: string
	category: string
	brand: string
}

const CreateProduct: FC<CreateProductProps> = ({ categories }) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		categories.length > 0 ? categories[0].title : null
	)
	const [thumbnail, setThumbnail] = useState<File | null>(null)
	const [productImages, setProductImages] = useState<File[]>([])
	const [value, setValue] = useState("")
	const selectValueGetterTitle = (option: ProductCategoryType) => option.title
	const selectLabelGetterTitle = (option: ProductCategoryType) => option.title
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value)
	}
	const selectedCategoryData =
		selectedCategory &&
		categories.find((category) => category.title === selectedCategory)
	const handleThumbnailUpload = (files: File[]) => {
		if (files.length > 0) {
			setThumbnail(files[0])
		}
	}
	const handleProductImagesUpload = (files: File[]) => {
		setProductImages([...productImages, ...files])
	}
	const handleDeleteThumbnail = () => {
		setThumbnail(null)
	}
	const handleDeleteProductImage = (index: number) => {
		const updatedImages = productImages.filter((_, i) => i !== index)
		setProductImages(updatedImages)
	}

	const handleSubmitProduct = handleSubmit(async (data) => {
		if (!thumbnail) {
			console.error("Thumbnail is required")
			return
		}
		const formData = new FormData()
		for (let i of Object.entries(data)) {
			formData.append(i[0], i[1])
		}
		if (thumbnail) {
			console.log()
			formData.append("thumbnail", thumbnail)
		}
		if (productImages) {
			for (let image of productImages) {
				formData.append("productImages", image)
			}
		}

		const response = await createProduct(formData)
		console.log(response)
	})

	return (
		<form onSubmit={handleSubmitProduct} className="w-full flex flex-col">
			<InputField
				label="Product name"
				name="productName"
				register={register}
				required
				errorMessage={
					errors.productName &&
					(errors.productName.message?.toString() ||
						"Please enter a valid product name.")
				}
			/>
			<div className="flex gap-4">
				<InputField
					label="Price"
					name="price"
					register={register}
					required
					validateType={"onlyNumbers"}
					errorMessage={
						errors.price &&
						(errors.price.message?.toString() || "Please enter a valid price.")
					}
				/>
				<InputField
					label="Quantity"
					name="quantity"
					register={register}
					required
					validateType={"onlyNumbers"}
					errorMessage={
						errors.quantity &&
						(errors.quantity.message?.toString() ||
							"Please enter a valid quantity.")
					}
				/>
			</div>
			<div className="flex gap-4">
				<Select
					name="category"
					label="Category"
					register={register}
					required
					options={categories}
					getValue={selectValueGetterTitle}
					getLabel={selectLabelGetterTitle}
					onChange={handleCategoryChange}
				/>
				{selectedCategoryData && (
					<BrandSelect
						name="brand"
						label="Brand"
						register={register}
						required
						options={selectedCategoryData.brand}
					/>
				)}
			</div>
			<div className="h-[200px]">
				<DynamicReactQuill
					theme="snow"
					value={value}
					onChange={setValue}
					className="h-[152px]"
				/>
			</div>
			<div className="w-full h-full">
				<h3 className="font-semibold">Thumbnail preview</h3>
				{thumbnail && (
					<ImagePreview images={thumbnail} onDelete={handleDeleteThumbnail} />
				)}
				<ImageUpload onUpload={handleThumbnailUpload} />

				<h3 className="font-semibold">Product images</h3>
				{productImages.length > 0 && (
					<ImagePreview
						images={productImages}
						onDelete={handleDeleteProductImage}
					/>
				)}
				<ImageUpload multiple onUpload={handleProductImagesUpload} />
			</div>

			<Button type="submit">Create product</Button>
		</form>
	)
}
export default CreateProduct
