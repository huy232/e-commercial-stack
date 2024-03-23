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
import { ApiResponse, ProductType, VariantType } from "@/types"
import { ChangeEvent, FC, useState, useEffect } from "react"
import { updateProductVariant } from "@/app/api"

interface ProductVariantProps {
	productResponse: ApiResponse<ProductType>
}

const ProductVariant: FC<ProductVariantProps> = ({ productResponse }) => {
	const [selectedColor, setSelectedColor] = useState<string>(
		(productResponse.data?.variants &&
			productResponse.data.variants[0]?.color) ||
			productResponse.data.color[0]
	)
	const variantTitle =
		(productResponse.data?.variants &&
			productResponse.data?.variants.find(
				(variant) => variant.color === selectedColor
			)?.title) ||
		productResponse.data.title
	const price =
		(productResponse.data?.variants &&
			productResponse.data?.variants.find(
				(variant) => variant.color === selectedColor
			)?.price) ||
		productResponse.data.price
	const [thumbnail, setThumbnail] = useState<string | File | null>(
		(productResponse.data?.variants &&
			productResponse.data?.variants.find(
				(variant) => variant.color === selectedColor
			)?.thumbnail) ||
			null
	)
	const [productImages, setProductImages] = useState<Array<string | File>>(
		(productResponse.data?.variants &&
			productResponse.data?.variants.find(
				(variant) => variant.color === selectedColor
			)?.images) ||
			[]
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
	const handleColorChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedColor(event.target.value)
	}
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
			const newProductImages = productImages.filter(
				(image) => typeof image !== "string"
			)
			const images = productImages.filter((image) => typeof image === "string")
			if (images.length > 0) {
				images.forEach((image) => formData.append("images", image))
			}
			if (newProductImages.length > 0) {
				newProductImages.forEach((image) =>
					formData.append("productImages", image)
				)
			} else {
				setProductImagesError("Please choose new pictures for product")
				hasError = true
			}
		} else {
			setProductImagesError("Please choose pictures for product")
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
	{
		console.log(productImages)
	}

	useEffect(() => {
		setThumbnail(
			(productResponse.data?.variants &&
				productResponse.data?.variants.find(
					(variant) => variant.color === selectedColor
				)?.thumbnail) ||
				null
		)
		setProductImages(
			(productResponse.data?.variants &&
				productResponse.data?.variants.find(
					(variant) => variant.color === selectedColor
				)?.images) ||
				[]
		)
	}, [productResponse.data?.variants, selectedColor])

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
						value={variantTitle}
						disabled={loading}
					/>
					<Option
						name="color"
						label="Color variant"
						options={productResponse.data.color}
						register={register}
						onChange={handleColorChange}
						selectedColor={selectedColor}
						disabled={loading}
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
						value={price}
						disabled={loading}
					/>
				</div>
				<div className="w-full h-full">
					<h3 className="font-semibold">Thumbnail preview</h3>
					<div className="flex items-center">
						{thumbnail && (
							<ImagePreview
								images={thumbnail}
								onDelete={handleDeleteThumbnail}
								disabled={loading}
							/>
						)}
					</div>
					<ImageUpload onUpload={handleThumbnailUpload} disabled={loading} />
					<h3 className="font-semibold">Product images</h3>
					<div className="flex items-center">
						{productImages.length > 0 && (
							<ImagePreview
								images={productImages}
								onDelete={handleDeleteProductImage}
								disabled={loading}
							/>
						)}
					</div>
					<ImageUpload
						multiple
						onUpload={handleProductImagesUpload}
						disabled={loading}
					/>
				</div>
				<div>
					{thumbnailError && (
						<span className="text-red-500">{thumbnailError}</span>
					)}
					{productImagesError && (
						<span className="text-red-500">{productImagesError}</span>
					)}
				</div>
				<Button type="submit" disabled={loading}>
					Create/update variant
				</Button>
			</form>
		</div>
	)
}
export default ProductVariant
