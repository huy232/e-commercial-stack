"use client"

import { ProductCategoryType, ProductType } from "@/types"
import { Dispatch, FC, SetStateAction, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"

interface UpdateProductProps {
	editProduct: ProductType
	onEditElement: () => void
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
	editProduct,
	onEditElement,
}) => {
	console.log(editProduct)
	const {
		register,
		reset,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ProductFormData>()
	const [selectedCategory, setSelectedCategory] = useState<string[] | null>(
		editProduct.category
	)
	const [value, setValueEditor] = useState<string>(editProduct.description)
	const [selectedColors, setSelectedColors] = useState<string[]>(
		editProduct.color
	)

	const [thumbnail, setThumbnail] = useState<File | null>(null)
	const [productImages, setProductImages] = useState<File[]>([])

	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [productImagesError, setProductImagesError] = useState<string>("")
	const [descriptionError, setDescriptionError] = useState<string>("")
	const [colorError, setColorError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)

	return <div>UpdateProduct</div>
}

export default UpdateProduct
