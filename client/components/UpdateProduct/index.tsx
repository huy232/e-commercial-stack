"use client"

import { ApiResponse, ProductCategoryType, ProductType } from "@/types"
import { FC, useEffect, useState } from "react"
import { FieldValues, useForm } from "react-hook-form"
import {
	BrandSelect,
	Button,
	Checkbox,
	ImagePreview,
	ImageUpload,
	InputField,
	LoadingSpinner,
	Modal,
	Select,
	TextEditor,
	VariantOptions,
} from "@/components"
import { URL } from "@/constant"

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
		allowVariants,
		brand,
		category,
		description,
		images,
		price,
		publicProduct,
		quantity,
		thumbnail,
		variants,
		title,
	} = productResponse.data

	const {
		register,
		handleSubmit,
		setValue,
		formState: { errors },
	} = useForm<ProductFormData>({
		defaultValues: {
			productName: title,
			price: price.toLocaleString(),
			quantity: quantity.toLocaleString(),
			category: category,
			brand: brand,
		},
	})

	const [selectedCategory, setSelectedCategory] = useState<string>(category)
	console.log("Selected category: ", selectedCategory)
	const [descriptionText, setDescriptionText] = useState<string>(description)
	const [thumbnailImage, setThumbnailImage] = useState<string | File | null>(
		thumbnail
	)
	const [productImages, setProductImages] =
		useState<Array<string | File>>(images)
	const [totalStock, setTotalStock] = useState(quantity)
	const [allowVariantsProduct, setAllowVariantsProduct] =
		useState(allowVariants)
	const [variantFields, setVariantFields] = useState<any[]>(variants || [])
	console.log(variants)
	const [allowPublicProduct, setAllowPublicProduct] = useState(publicProduct)

	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [productImagesError, setProductImagesError] = useState<string>("")
	const [descriptionError, setDescriptionError] = useState<string>("")
	const [loading, setLoading] = useState<boolean>(false)

	const selectValueGetter = (option: ProductCategoryType) => option._id
	const selectLabelGetter = (option: ProductCategoryType) => option.title
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value)
	}
	const selectedCategoryData = categories.find(
		(category) => category._id === selectedCategory
	)

	const handleThumbnailUpload = (files: File[]) => {
		if (files.length > 0) {
			setThumbnailImage(files[0])
			setThumbnailError("")
		}
	}
	const handleProductImagesUpload = (files: File[]) => {
		setProductImages([...productImages, ...files])
		setProductImagesError("")
	}
	const handleDeleteThumbnail = () => {
		setThumbnailImage(null)
	}
	const handleDeleteProductImage = (index: number) => {
		const updatedImages = [...productImages]
		updatedImages.splice(index, 1)
		setProductImages(updatedImages)
	}
	const handleAllowVariantsChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setAllowVariantsProduct(e.target.checked)
		if (!e.target.checked) {
			setTotalStock(0)
		}
	}
	const handlePublicProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAllowPublicProduct(e.target.checked)
	}

	const handleSubmitProduct = handleSubmit(async (data) => {
		let hasError = false
		const formData = new FormData()
		for (let [key, value] of Object.entries(data)) {
			if (key === "price" || key === "quantity") {
				value = value = value.replace(/[^0-9]/g, "")
				console.log("Key: ", key, "Value: ", value)
				formData.append(key, value)
			} else {
				formData.append(key, value)
			}
		}
		formData.append("allowVariants", JSON.stringify(allowVariants))
		if (descriptionText) {
			formData.append("description", descriptionText)
		} else {
			setDescriptionError("Please enter description for the product")
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
		formData.append("publicProduct", JSON.stringify(allowPublicProduct))
		formData.append("variants", JSON.stringify(variantFields))
		if (hasError) {
			return
		}
		setLoading(true)
		const updateProductResponse = await fetch(URL + "/api/product/", {
			method: "PUT",
			body: formData,
		})
		const responseData = await updateProductResponse.json()
		console.log(responseData)
		setLoading(false)
		// await updateProduct(productResponse.data._id, formData)
		// 	.then(() => {
		// 		setDescriptionError("")
		// 		setThumbnailError("")
		// 		setProductImagesError("")
		// 	})
		// 	.finally(() => {
		// 		setLoading(false)
		// 	})
	})

	useEffect(() => {
		if (variantFields.length > 0) {
			const totalQuantityStock = variantFields.reduce((acc, currentStock) => {
				const numberValue = currentStock.stock
				const parsedValue = parseInt(
					numberValue.toString().replace(/,/g, ""),
					10
				)
				return acc + (isNaN(parsedValue) ? 0 : parsedValue)
			}, 0)
			setValue("quantity", totalQuantityStock.toLocaleString())
		} else {
			setValue("quantity", "0")
		}
	}, [variantFields, allowVariants, setValue])

	if (!productResponse.success) {
		return (
			<div>
				Something went wrong with the product itself. Can not proceed to update
			</div>
		)
	}

	return (
		<>
			{loading && (
				<Modal isOpen={true}>
					<div>
						<LoadingSpinner color="red-500" text="Updating product..." />
					</div>
				</Modal>
			)}
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
						disabled={loading}
					/>
				</div>
				<div className="flex gap-4">
					<InputField
						label="Price"
						name="price"
						register={register}
						required="Price is required"
						validateType={"onlyNumbers"}
						errorMessage={
							errors.price &&
							(errors.price.message?.toString() ||
								"Please enter a valid price.")
						}
						disabled={loading}
					/>
					<InputField
						label="Quantity"
						name="quantity"
						register={register}
						required="Quantity is required"
						validateType={"onlyNumbers"}
						errorMessage={
							errors.quantity &&
							(errors.quantity.message?.toString() ||
								"Please enter a valid quantity.")
						}
						disabled={loading || variantFields.length > 0}
					/>
				</div>
				<div className="flex gap-4">
					<Select
						name="category"
						label="Category"
						register={register}
						required
						options={categories}
						getValue={selectValueGetter}
						getLabel={selectLabelGetter}
						value={selectedCategory}
						disabled={loading}
						onChange={handleCategoryChange}
					/>
					{selectedCategoryData && (
						<BrandSelect
							name="brand"
							label="Brand"
							register={register}
							required
							options={selectedCategoryData.brand}
							value={brand}
							disabled={loading}
						/>
					)}
				</div>
				<div>
					<Checkbox
						label="Allow Variants"
						name="allowVariants"
						checked={allowVariantsProduct}
						onChange={handleAllowVariantsChange}
					/>
					{allowVariantsProduct && selectedCategory && (
						<VariantOptions
							category={selectedCategory}
							variantFields={variantFields}
							setVariantFields={setVariantFields}
							categories={categories}
						/>
					)}
				</div>
				<TextEditor value={descriptionText} onChange={setDescriptionText} />

				<div className="w-full h-full">
					<h3 className="font-semibold">Thumbnail preview</h3>
					<div className="flex items-center">
						{thumbnailImage && (
							<ImagePreview
								images={thumbnailImage}
								onDelete={handleDeleteThumbnail}
								disabled={loading}
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
								disabled={loading}
							/>
						)}
					</div>
					<ImageUpload multiple onUpload={handleProductImagesUpload} />
				</div>
				<Checkbox
					label="Public right away?"
					name="public"
					checked={publicProduct}
					onChange={handlePublicProduct}
				/>
				{thumbnailError && (
					<span className="text-red-500">{thumbnailError}</span>
				)}
				{productImagesError && (
					<span className="text-red-500">{productImagesError}</span>
				)}
				{descriptionError && (
					<span className="text-red-500">{descriptionError}</span>
				)}
				<Button disabled={loading} type="submit">
					Update product
				</Button>
			</form>
		</>
	)
}

export default UpdateProduct
