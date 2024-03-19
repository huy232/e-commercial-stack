"use client"

import { useForm } from "react-hook-form"
import {
	Button,
	ColorSelect,
	ImagePreview,
	ImageUpload,
	InputField,
	Option,
} from "@/components"
import { ApiResponse, ProductType } from "@/types"
import { ChangeEvent, FC, useState } from "react"
import { updateProductVariant } from "@/app/api"

interface ProductVariantProps {
	productResponse: ApiResponse<ProductType>
}

const ProductVariant: FC<ProductVariantProps> = ({ productResponse }) => {
	const [thumbnail, setThumbnail] = useState<string | File | null>(
		productResponse.data?.variant?.thumbnail || null
	)
	const [productImages, setProductImages] = useState<Array<string | File>>(
		productResponse.data?.variant?.images || []
	)
	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [productImagesError, setProductImagesError] = useState<string>("")
	const [loading, setLoading] = useState(false)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm()
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
	const handleSubmitProduct = handleSubmit(async (data) => {
		let hasError = false
		const formData = new FormData()
		for (let i of Object.entries(data)) {
			formData.append(i[0], i[1])
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
		await updateProductVariant(productResponse.data._id, formData)
			.then(() => {
				setThumbnailError("")
				setProductImagesError("")
			})
			.finally(() => {
				setLoading(false)
			})
	})

	return (
		<div>
			<form onSubmit={handleSubmitProduct}>
				<div className="flex gap-4">
					<InputField
						label="Variant name"
						name="title"
						register={register}
						required
						errorMessage={
							errors.title &&
							(errors.title.message?.toString() ||
								"Please enter a valid product variant name.")
						}
						value={productResponse.data.title}
					/>
					<Option
						name="color"
						label="Color variant"
						options={productResponse.data.color}
						register={register}
					/>
				</div>
				<div className="flex gap-4">
					<InputField
						label="Variant price"
						name="price"
						register={register}
						required
						validateType={"onlyNumbers"}
						errorMessage={
							errors.price &&
							(errors.price.message?.toString() ||
								"Please enter a valid variant price.")
						}
					/>
				</div>
				<div className="w-full h-full">
					<h3 className="font-semibold">Thumbnail preview</h3>
					<div className="flex items-center">
						{thumbnail && (
							<ImagePreview
								images={thumbnail}
								onDelete={handleDeleteThumbnail}
							/>
						)}
					</div>
					<ImageUpload onUpload={handleThumbnailUpload} />
					<h3 className="font-semibold">Product images</h3>
					<div className="flex items-center">
						{productImages.length > 0 && (
							<ImagePreview
								images={productImages}
								onDelete={handleDeleteProductImage}
							/>
						)}
					</div>
					<ImageUpload multiple onUpload={handleProductImagesUpload} />
				</div>
				<div>
					{thumbnailError && (
						<span className="text-red-500">{thumbnailError}</span>
					)}
					{productImagesError && (
						<span className="text-red-500">{productImagesError}</span>
					)}
				</div>
				<Button type="submit">Create product</Button>
			</form>
		</div>
	)
}
export default ProductVariant
