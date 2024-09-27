"use client"
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
import { FC, useEffect, useState } from "react"
import { CategoryType, ProductCategoryType } from "@/types"
import { useMounted } from "@/hooks"
import { URL } from "@/constant"

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
		setValue,
	} = useForm<ProductFormData>({
		defaultValues: {
			productName: "",
			price: "0",
			quantity: "0",
		},
	})
	const mounted = useMounted()
	const [selectedCategory, setSelectedCategory] = useState<string | null>(
		categories.length > 0 ? categories[0].title : null
	)
	const [allowVariants, setAllowVariants] = useState<boolean>(false)
	const [variantFields, setVariantFields] = useState<any[]>([])
	const [description, setDescription] = useState("")
	const [thumbnail, setThumbnail] = useState<File | null>(null)
	const [productImages, setProductImages] = useState<File[]>([])
	const [publicProduct, setPublicProduct] = useState<boolean>(false)

	const [loading, setLoading] = useState<boolean>(false)

	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [productImagesError, setProductImagesError] = useState<string>("")
	const [descriptionError, setDescriptionError] = useState<string>("")

	const selectValueGetterTitle = (option: ProductCategoryType) => option._id
	const selectLabelGetterTitle = (option: ProductCategoryType) => option.title
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value)
	}
	const selectedCategoryData = categories.find(
		(category) => category.title === selectedCategory
	) as CategoryType

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
	const handleAllowVariantsChange = (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		setAllowVariants(e.target.checked)
		if (!e.target.checked) {
			setValue("quantity", "0")
		}
	}
	const handlePublicProduct = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPublicProduct(e.target.checked)
	}

	const handleSubmitProduct = handleSubmit(async (data) => {
		let hasError = false
		const formData = new FormData()
		console.log(data)
		for (let [key, value] of Object.entries(data)) {
			if (key === "price" || key === "quantity") {
				value = value = value.replace(/[^0-9]/g, "")
				console.log("Key: ", key, " --- ", "Value: ", value)
				formData.append(key, value)
			} else {
				console.log("Key: ", key, " --- ", "Value: ", value)
				formData.append(key, value)
			}
		}
		formData.append("allowVariants", JSON.stringify(allowVariants))
		if (description) {
			formData.append("description", description)
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
		formData.append("publicProduct", JSON.stringify(publicProduct))
		formData.append("variants", JSON.stringify(variantFields))
		if (hasError) {
			return
		}

		setLoading(true)

		const createProductResponse = await fetch(URL + "/api/product", {
			method: "POST",
			body: formData,
		})
		const responseData = await createProductResponse.json()
		if (responseData.success) {
			reset({
				quantity: "0",
				price: "0",
				productName: "",
			})
			setValue("quantity", "0")
			setThumbnail(null)
			setProductImages([])
			setDescription("")
			setAllowVariants(false)
			setPublicProduct(false)
		}
		setLoading(false)
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
		}
	}, [variantFields, allowVariants, setValue])

	if (!mounted) {
		return <></>
	}
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
						required="Product name is required"
						errorMessage={
							errors.productName &&
							(errors.productName.message?.toString() ||
								"Please enter a valid product name.")
						}
					/>
				</div>
				<div className="flex gap-4">
					<InputField
						label="Default price"
						name="price"
						register={register}
						required="Price is required"
						validateType={"onlyNumbers"}
						errorMessage={
							errors.price &&
							(errors.price.message?.toString() || "Please enter a valid price")
						}
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
						disabled={allowVariants}
					/>
				</div>
				<div className="flex gap-4">
					<Select
						label="Category"
						name="category"
						register={register}
						required
						options={categories}
						getValue={selectValueGetterTitle}
						getLabel={selectLabelGetterTitle}
						onChange={handleCategoryChange}
					/>
					{selectedCategoryData && selectedCategoryData.brand && (
						<BrandSelect
							name="brand"
							label="Brand"
							register={register}
							required
							options={selectedCategoryData.brand}
						/>
					)}
				</div>
				<div>
					{selectedCategoryData.option &&
					selectedCategoryData.option.length > 0 ? (
						<Checkbox
							label="Allow Variants"
							name="allowVariants"
							checked={allowVariants}
							onChange={handleAllowVariantsChange}
						/>
					) : (
						<div>Currently supported no variant</div>
					)}
					{allowVariants && selectedCategory && (
						<VariantOptions
							category={selectedCategory}
							variantFields={variantFields}
							setVariantFields={setVariantFields}
							categories={categories}
						/>
					)}
				</div>
				<TextEditor value={description} onChange={setDescription} />
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
				<Button type="submit">Create product</Button>
			</form>
		</>
	)
}
export default CreateProduct
