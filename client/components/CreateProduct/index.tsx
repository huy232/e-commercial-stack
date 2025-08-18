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

		setLoading(true)

		const createProductResponse = await fetch(API + "/product/create-product", {
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
				<Modal isOpen={true}>
					<LoadingSpinner color="red-500" text="Creating product..." />
				</Modal>
			)}
			<form
				onSubmit={handleSubmitProduct}
				className="w-full grid grid-cols-2 gap-4"
			>
				<div className="bg-neutral-400 bg-opacity-50 rounded py-1 px-3 mt-2 mb-6 inline-block h-fit">
					<div className="flex gap-2 mb-2">
						<InputField
							label="Name"
							name="productName"
							register={register}
							required="Product name is required"
							errorMessage={
								errors.productName &&
								(errors.productName.message?.toString() ||
									"Please enter a valid product name.")
							}
							inputAdditionalClass="w-full"
						/>
					</div>
					<div className="flex gap-2 mb-2">
						<InputField
							label="Price"
							name="price"
							register={register}
							required="Price is required"
							validateType={"onlyNumbers"}
							errorMessage={
								errors.price &&
								(errors.price.message?.toString() ||
									"Please enter a valid price")
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
					<div className="flex gap-2 mb-2">
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
					{selectedCategoryData.option &&
					selectedCategoryData.option.length > 0 ? (
						<Checkbox
							label="Allow variants"
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
					<div className="w-full px-2">
						<EditorPreviewContainer
							ref={editorPreviewRef}
							initialContent={descriptionRef.current}
							onContentChange={(content) => (descriptionRef.current = content)}
							images={images}
							onImageChange={setImages}
						/>
					</div>
				</div>
				<div className="px-4">
					<h3 className="font-semibold">Thumbnail preview</h3>
					{thumbnail && (
						<div className="flex items-center">
							<ImagePreview
								images={[thumbnail]}
								onDelete={handleDeleteThumbnail}
							/>
						</div>
					)}
					<ImageUpload onUpload={handleThumbnailUpload} />

					<h3 className="font-semibold mt-4">Product images</h3>
					{productImages.length > 0 && (
						<div className="lg:w-full overflow-y-auto flex flex-wrap max-h-[320px]">
							<ImagePreview
								images={productImages}
								onDelete={handleDeleteProductImage}
							/>
						</div>
					)}
					<ImageUpload multiple onUpload={handleProductImagesUpload} />
				</div>
				<div className="flex flex-col items-end gap-2">
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
						className="w-fit bg-rose-500 p-1 hover:bg-opacity-70 hover:brightness-125 duration-300 ease-in-out rounded"
					>
						Create product
					</Button>
				</div>
			</form>
		</>
	)
}
export default CreateProduct
