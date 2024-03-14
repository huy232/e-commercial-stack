"use client"

import { ApiResponse, ProductCategoryType, ProductType } from "@/types"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import { ColorSelect, InputField } from ".."

interface UpdateProductProps {
	productResponse: ApiResponse<ProductType>
}

interface ProductFormData extends FieldValues {
	productName: string
	price: string
	quantity: string
	category: string
	brand: string
	colors: string[]
}

const UpdateProduct: FC<UpdateProductProps> = ({ productResponse }) => {
	const {
		register,
		reset,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ProductFormData>()
	const [selectedCategory, setSelectedCategory] = useState<string[] | null>(
		productResponse.data.category
	)
	const [value, setValueEditor] = useState<string>(
		productResponse.data.description
	)
	const [selectedColors, setSelectedColors] = useState<string[]>(
		productResponse.data.color
	)

	const [thumbnail, setThumbnail] = useState<File | null>(null)
	const [productImages, setProductImages] = useState<File[]>([])

	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [productImagesError, setProductImagesError] = useState<string>("")
	const [descriptionError, setDescriptionError] = useState<string>("")
	const [colorError, setColorError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)

	const handleColorChange = (colors: string[]) => {
		setSelectedColors(colors)
		setColorError("")
	}

	if (!productResponse.success) {
		return (
			<div>
				Something went wrong with the product itself. Can not proceed to update
			</div>
		)
	}

	return (
		<div>
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
		</div>
	)
}

export default UpdateProduct
