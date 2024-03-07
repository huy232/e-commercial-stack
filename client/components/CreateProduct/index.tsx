"use client"
import { useForm } from "react-hook-form"
import {
	BrandSelect,
	Button,
	CustomImage,
	ImageUpload,
	InputField,
	InputForm,
	Select,
} from "@/components"
import { FC, useState } from "react"
import { ProductCategoryType } from "@/types"

interface CreateProductProps {
	categories: ProductCategoryType[]
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

	const handleSubmitProduct = handleSubmit((data) => {
		console.log(data)
	})

	const selectValueGetterTitle = (option: ProductCategoryType) => option.title
	const selectLabelGetterTitle = (option: ProductCategoryType) => option.title
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value)
	}
	const selectedCategoryData =
		selectedCategory &&
		categories.find((category) => category.title === selectedCategory)
	const handleThumbnailUpload = (file: FileList | File) => {
		console.log("Run this is upload single image")
		if (file instanceof File) {
			setThumbnail(file)
		}
	}

	const handleProductImagesUpload = (files: FileList | File) => {
		console.log("Run this if upload multiple images")
		if (files instanceof FileList) {
			const imageFiles = Array.from(files)
			setProductImages([...productImages, ...imageFiles])
		} else {
			setProductImages([...productImages, files])
		}
	}

	console.log(thumbnail)
	console.log(productImages)

	return (
		<form onSubmit={handleSubmitProduct}>
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
			{thumbnail && (
				<div>
					<p>Thumbnail Preview:</p>
					<CustomImage
						src={URL.createObjectURL(thumbnail)}
						alt="Thumbnail"
						width={160}
						height={160}
					/>
				</div>
			)}
			<ImageUpload onUpload={handleThumbnailUpload} />
			{productImages.length > 0 && (
				<div>
					<p>Product Image Previews:</p>
					{productImages.map((image, index) => (
						<CustomImage
							key={index}
							src={URL.createObjectURL(image)}
							alt={`Product Image ${index + 1}`}
							width={160}
							height={160}
						/>
					))}
				</div>
			)}
			<ImageUpload multiple onUpload={handleProductImagesUpload} />
			<Button type="submit">Create product</Button>
		</form>
	)
}
export default CreateProduct
