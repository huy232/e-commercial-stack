"use client"

import { useForm } from "react-hook-form"
import {
	ColorSelect,
	ImagePreview,
	ImageUpload,
	InputField,
} from "@/components"
import { ApiResponse, ProductType } from "@/types"
import { FC, useState } from "react"

interface ProductVariantProps {
	productResponse: ApiResponse<ProductType>
}

const ProductVariant: FC<ProductVariantProps> = ({ productResponse }) => {
	const [selectedColors, setSelectedColors] = useState<string[]>(
		productResponse.data.color
	)
	const [colorError, setColorError] = useState<string>("")
	const [thumbnail, setThumbnail] = useState<string | File | null>(
		productResponse.data?.variant?.thumbnail || null
	)
	const [productImages, setProductImages] = useState<Array<string | File>>(
		productResponse.data?.variant?.images || []
	)
	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [productImagesError, setProductImagesError] = useState<string>("")

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
	} = useForm()
	const handleColorChange = (colors: string[]) => {
		setSelectedColors(colors)
		setColorError("")
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

	return (
		<div>
			<form>
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
							(errors.price.message?.toString() ||
								"Please enter a valid price.")
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
			</form>
		</div>
	)
}
export default ProductVariant
