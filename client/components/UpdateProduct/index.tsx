"use client"

import { ApiResponse, ProductCategoryType, ProductType } from "@/types"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import {
	BrandSelect,
	Button,
	ColorSelect,
	ImagePreview,
	ImageUpload,
	InputField,
	Select,
} from ".."
import ReactQuill from "react-quill"
import { updateProduct } from "@/app/api"

interface UpdateProductProps {
	productResponse: ApiResponse<ProductType>
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

const UpdateProduct: FC<UpdateProductProps> = ({
	productResponse,
	categories,
}) => {
	const {
		register,
		reset,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ProductFormData>()
	console.log(productResponse.data)
	const initialCategory = productResponse.data.category[1]
	const initialBrand = productResponse.data.brand
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		productResponse.data.category[1]
	)
	const [value, setValueEditor] = useState<string>(
		productResponse.data.description
	)
	const [selectedColors, setSelectedColors] = useState<string[]>(
		productResponse.data.color
	)

	const [thumbnail, setThumbnail] = useState<string | File | null>(
		productResponse.data.thumbnail
	)
	const [productImages, setProductImages] = useState<Array<string | File>>(
		productResponse.data.images
	)

	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [productImagesError, setProductImagesError] = useState<string>("")
	const [descriptionError, setDescriptionError] = useState<string>("")
	const [colorError, setColorError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)

	const handleColorChange = (colors: string[]) => {
		setSelectedColors(colors)
		setColorError("")
	}
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
		const updatedImages = [...productImages]
		updatedImages.splice(index, 1)
		setProductImages(updatedImages)
	}

	if (!productResponse.success) {
		return (
			<div>
				Something went wrong with the product itself. Can not proceed to update
			</div>
		)
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
		await updateProduct(productResponse.data._id, formData)
			.then(() => {
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
		<form onSubmit={handleSubmitProduct} className="w-full flex flex-col">
			<div>
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
					value={productResponse.data.title}
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
						(errors.price.message?.toString() || "Please enter a valid price.")
					}
					value={productResponse.data.price}
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
					value={productResponse.data.quantity}
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
					value={initialCategory}
				/>
				{selectedCategoryData && (
					<BrandSelect
						name="brand"
						label="Brand"
						register={register}
						required
						options={selectedCategoryData.brand}
						value={initialBrand}
					/>
				)}
			</div>
			<div className="h-[200px]">
				<ReactQuill
					theme="snow"
					value={value}
					onChange={setValueEditor}
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
			<Button type="submit">Update product</Button>
		</form>
	)
}

export default UpdateProduct
