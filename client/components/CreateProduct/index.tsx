"use client"
import { FieldValues, useForm } from "react-hook-form"
import {
	BrandSelect,
	Button,
	Checkbox,
	EditorPreviewContainer,
	ImagePreview,
	ImageUpload,
	InputField,
	LoadingSpinner,
	Modal,
	Select,
	VariantOptions,
} from "@/components"
import { FC, useEffect, useRef, useState } from "react"
import { CategoryType, ProductCategoryType } from "@/types"
import { useMounted } from "@/hooks"
import { API } from "@/constant"
import { processEditorContentWithUpload } from "@/utils"

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
		categories[0]._id
	)
	const [allowVariants, setAllowVariants] = useState<boolean>(false)
	const [variantFields, setVariantFields] = useState<any[]>([])

	const [thumbnail, setThumbnail] = useState<File | null>(null)
	const [productImages, setProductImages] = useState<File[]>([])
	const [publicProduct, setPublicProduct] = useState<boolean>(false)

	const [loading, setLoading] = useState<boolean>(false)

	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [productImagesError, setProductImagesError] = useState<string>("")
	const [descriptionError, setDescriptionError] = useState<string>("")

	const descriptionRef = useRef<string>("")
	const editorPreviewRef = useRef<{
		clear: () => void
		getContent: () => string
		getLocalImages: () => string[]
	} | null>(null)

	const [images, setImages] = useState<string[]>([])

	const selectValueGetterTitle = (option: ProductCategoryType) => option._id
	const selectLabelGetterTitle = (option: ProductCategoryType) => option.title

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value)
	}

	const selectedCategoryData = categories.find(
		(category) => category._id === selectedCategory
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
		for (let [key, value] of Object.entries(data)) {
			if (key === "price" || key === "quantity") {
				value = value = value.replace(/[^0-9]/g, "")
				formData.append(key, value)
			} else {
				formData.append(key, value)
			}
		}
		formData.append("allowVariants", JSON.stringify(allowVariants))

		const { description, error } = await processEditorContentWithUpload(
			editorPreviewRef
		)

		if (error) {
			setDescriptionError(error)
			hasError = true
		} else {
			formData.append("description", description)
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

		try {
			setLoading(true)
			const createProductResponse = await fetch("/api/product/create-product", {
				method: "POST",
				body: formData,
				credentials: "include",
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
				setVariantFields([])
				setAllowVariants(false)
				setPublicProduct(false)
				if (editorPreviewRef.current) {
					editorPreviewRef.current.clear()
				}
			}
		} catch (error) {
			console.log(error)
		} finally {
			setLoading(false)
		}
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

	if (!mounted) {
		return <></>
	}
	return (
		<>
			{loading && (
				<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
					<div className="flex flex-col items-center gap-4 bg-white p-6 rounded-lg shadow-lg">
						<div className="animate-spin rounded-full h-10 w-10 border-4 border-red-500 border-t-transparent"></div>
						<p className="text-gray-700 font-medium">Creating product...</p>
					</div>
				</div>
			)}
			<form
				onSubmit={handleSubmitProduct}
				className="w-full flex flex-col lg:grid lg:grid-cols-2 gap-6"
			>
				{/* Left Section - Product Info */}
				<div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-4">
					{/* Name, Price, Quantity */}
					<div className="flex flex-col gap-4">
						<InputField
							label="Name"
							name="productName"
							register={register}
							required="Product name is required"
							errorMessage={errors.productName?.message?.toString()}
						/>
						<div className="flex flex-col sm:flex-row gap-4">
							<InputField
								label="Price"
								name="price"
								register={register}
								required="Price is required"
								validateType="onlyNumbers"
								errorMessage={errors.price?.message?.toString()}
							/>
							<InputField
								label="Quantity"
								name="quantity"
								register={register}
								required="Quantity is required"
								validateType="onlyNumbers"
								errorMessage={errors.quantity?.message?.toString()}
								disabled={allowVariants}
							/>
						</div>
					</div>

					{/* Category + Brand */}
					<div className="flex flex-col sm:flex-row gap-4">
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
						{selectedCategoryData?.brand && (
							<BrandSelect
								name="brand"
								label="Brand"
								register={register}
								required
								options={selectedCategoryData.brand}
							/>
						)}
					</div>

					{/* Variants */}
					{selectedCategoryData?.option?.length > 0 ? (
						<Checkbox
							label="Allow variants"
							name="allowVariants"
							checked={allowVariants}
							onChange={handleAllowVariantsChange}
						/>
					) : (
						<div className="text-sm text-gray-500">
							Currently no variant supported
						</div>
					)}
					{allowVariants && selectedCategory && (
						<VariantOptions
							category={selectedCategory}
							variantFields={variantFields}
							setVariantFields={setVariantFields}
							categories={categories}
						/>
					)}

					{/* Editor */}
					<div className="w-full">
						<EditorPreviewContainer
							ref={editorPreviewRef}
							initialContent={descriptionRef.current}
							onContentChange={(content) => (descriptionRef.current = content)}
							images={images}
							onImageChange={setImages}
						/>
					</div>
				</div>

				{/* Right Section - Images & Controls */}
				<div className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-6">
					{/* Thumbnail */}
					<div>
						<h3 className="font-semibold mb-2">Thumbnail</h3>
						{thumbnail && (
							<ImagePreview
								images={[thumbnail]}
								onDelete={handleDeleteThumbnail}
							/>
						)}
						<ImageUpload onUpload={handleThumbnailUpload} />
					</div>

					{/* Product Images */}
					<div>
						<h3 className="font-semibold mb-2">Product Images</h3>
						{productImages.length > 0 && (
							<div className="overflow-y-auto flex flex-wrap gap-2 max-h-[320px]">
								<ImagePreview
									images={productImages}
									onDelete={handleDeleteProductImage}
								/>
							</div>
						)}
						<ImageUpload multiple onUpload={handleProductImagesUpload} />
					</div>

					{/* Options */}
					<div className="flex flex-col gap-2">
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
						<Button
							type="submit"
							className="bg-rose-500 text-white p-2 rounded-lg hover:bg-rose-600 transition f-full md:w-fit"
							disabled={loading}
							aria-label="Create Product"
							role="button"
							tabIndex={0}
							data-testid="create-product-button"
							id="create-product-button"
							loading={loading}
						>
							Create Product
						</Button>
					</div>
				</div>
			</form>
		</>
	)
}
export default CreateProduct
