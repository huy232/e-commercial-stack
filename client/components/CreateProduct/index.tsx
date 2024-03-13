"use client"
import { FieldValues, useForm } from "react-hook-form"
import {
	BrandSelect,
	Button,
	ColorSelect,
	ImagePreview,
	ImageUpload,
	InputField,
	LoadingSpinner,
	Modal,
	Select,
} from "@/components"
import { FC, useState } from "react"
import { ProductCategoryType } from "@/types"
import { createProduct } from "@/app/api"
import ReactQuill from "react-quill"

interface CreateProductProps {
	categories: ProductCategoryType[]
}

interface ProductFormData extends FieldValues {
	productName: string
	price: string
	quantity: string
	category: string
	brand: string
	colors: string[]
}

const CreateProduct: FC<CreateProductProps> = ({ categories }) => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
	} = useForm<ProductFormData>()
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		categories.length > 0 ? categories[0].title : null
	)
	const [thumbnail, setThumbnail] = useState<File | null>(null)
	const [productImages, setProductImages] = useState<File[]>([])
	const [value, setValue] = useState("")
	const [selectedColors, setSelectedColors] = useState<string[]>([])
	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [productImagesError, setProductImagesError] = useState<string>("")
	const [descriptionError, setDescriptionError] = useState<string>("")
	const [colorError, setColorError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)

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
			setThumbnailError("")
		}
	}
	const handleProductImagesUpload = (files: File[]) => {
		setProductImages([...productImages, ...files])
		setProductImagesError("")
	}
	const handleDeleteThumbnail = () => {
		setThumbnail(null)
	}
	const handleDeleteProductImage = (index: number) => {
		const updatedImages = productImages.filter((_, i) => i !== index)
		setProductImages(updatedImages)
	}
	const handleColorChange = (colors: string[]) => {
		setSelectedColors(colors)
		setColorError("")
	}

	const handleSubmitProduct = handleSubmit(async (data) => {
		let hasError = false
		const formData = new FormData()
		for (let i of Object.entries(data)) {
			formData.append(i[0], i[1])
		}
		if (value) {
			formData.append("description", JSON.stringify(value))
		} else {
			setDescriptionError("Please enter description for the product")
			hasError = true
		}
		if (selectedColors.length > 0) {
			selectedColors.forEach((color) => {
				formData.append("color[]", color)
			})
		} else {
			setColorError("Please choose at least one color")
			hasError = true
		}
		if (thumbnail) {
			formData.append("thumbnail", thumbnail)
		} else {
			setThumbnailError("Thumbnail is required")
			hasError = true
		}
		if (productImages) {
			for (let image of productImages) {
				formData.append("productImages", image)
			}
		} else {
			setProductImagesError("Please choose a picture for product")
			hasError = true
		}
		if (hasError) {
			return
		}
		setLoading(true)
		await createProduct(formData)
			.then(() => {
				reset()
				setThumbnail(null)
				setProductImages([])
				setValue("")
				setSelectedColors([])
				setDescriptionError("")
				setColorError("")
				setThumbnailError("")
				setProductImagesError("")
			})
			.finally(() => {
				setLoading(false)
			})
	})

	return (
		<>
			{loading && (
				<Modal isOpen={true}>
					<div>
						<LoadingSpinner color="red-500" text="Creating product..." />
					</div>
				</Modal>
			)}
			<form onSubmit={handleSubmitProduct} className="w-full flex flex-col">
				<div className="flex gap-4">
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
					<ColorSelect
						onColorsChange={handleColorChange}
						selectedColors={selectedColors}
					/>
				</div>
				<div className="flex gap-4">
					<InputField
						label="Price"
						name="price"
						register={register}
						required
						validateType={"onlyNumbers"}
						errorMessage={
							errors.price &&
							(errors.price.message?.toString() ||
								"Please enter a valid price.")
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
					<ReactQuill
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
				{thumbnailError && (
					<span className="text-red-500">{thumbnailError}</span>
				)}
				{productImagesError && (
					<span className="text-red-500">{productImagesError}</span>
				)}
				{descriptionError && (
					<span className="text-red-500">{descriptionError}</span>
				)}
				{colorError && <span className="text-red-500">{colorError}</span>}
				<Button type="submit">Create product</Button>
			</form>
		</>
	)
}
export default CreateProduct
