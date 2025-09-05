"use client"

import {
	ApiResponse,
	CategoryType,
	ProductCategoryType,
	ProductExtraType,
} from "@/types"
import { FC, useEffect, useRef, useState } from "react"
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
	Radio,
	Select,
	VariantOptions,
} from "@/components"
import { API, extractImageUrlsFromHTML } from "@/constant"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { processEditorContentWithUpload } from "@/utils"

interface UpdateProductProps {
	productResponse: ApiResponse<ProductExtraType>
	categories: ProductCategoryType[]
}

interface ProductFormData extends FieldValues {
	productName: string
	price: string
	quantity: string
	category: string
	brand: string
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
		quantity,
		thumbnail,
		variants,
		title,
		enableDiscount,
	} = productResponse.data

	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		watch,
		formState: { errors },
	} = useForm<ProductFormData>({
		defaultValues: {
			productName: title,
			price: price ? price.toLocaleString() : "0",
			quantity: quantity ? quantity.toLocaleString() : "0",
			category: category._id,
			brand: brand._id,
			discountType: productResponse.data?.discount
				? productResponse.data?.discount.type
				: "",
			discountValue: productResponse.data?.discount
				? productResponse.data?.discount.value
				: "0",
			enableDiscount: enableDiscount,
			publicProduct: productResponse.data.publicProduct,
			allowVariants: productResponse.data.allowVariants,
		},
	})

	const enableDiscountCheck = watch("enableDiscount")
	const allowVariantsCheck = watch("allowVariants")
	const discountTypeCheck = watch("discountType")
	const publicProductCheck = watch("publicProduct")
	const [selectedCategory, setSelectedCategory] = useState<string>(category._id)
	const editorPreviewRef = useRef<{
		clear: () => void
		getContent: () => string
		getLocalImages: () => string[]
	} | null>(null)
	const descriptionRef = useRef<string>(description)

	const [descriptionImages, setDescriptionImages] = useState<string[]>(
		productResponse?.data?.description
			? extractImageUrlsFromHTML(productResponse.data.description)
			: []
	)
	const [thumbnailImage, setThumbnailImage] = useState<string | File | null>(
		thumbnail
	)

	const [productImages, setProductImages] =
		useState<Array<string | File>>(images)
	const [expirationDate, setExpirationDate] = useState<Date | null>(
		productResponse.data?.discount?.expirationDate
			? new Date(productResponse.data.discount.expirationDate)
			: null
	)
	const [variantFields, setVariantFields] = useState<any[]>(variants || [])
	const [errorMessages, setErrorMessages] = useState<string[]>([])
	const [loading, setLoading] = useState<boolean>(false)

	const selectValueGetter = (option: ProductCategoryType) => option._id
	const selectLabelGetter = (option: ProductCategoryType) => option.title
	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setSelectedCategory(e.target.value)
	}
	const selectedCategoryData = categories.find(
		(category) => category._id === selectedCategory
	) as CategoryType
	const addError = (message: string) => {
		if (!errorMessages.includes(message)) {
			setErrorMessages((prevErrors) => [...prevErrors, message])
		}
	}
	const clearErrors = () => {
		setErrorMessages([])
	}
	const removeError = (message: string) => {
		setErrorMessages((prevErrors) =>
			prevErrors.filter((error) => error !== message)
		)
	}
	const handleThumbnailUpload = (files: File[]) => {
		if (files.length > 0) {
			setThumbnailImage(files[0])
			removeError("Thumbnail is required.")
		}
	}
	const handleProductImagesUpload = (files: File[]) => {
		setProductImages([...productImages, ...files])
		removeError("Please choose a picture for the product.")
	}
	const handleDeleteThumbnail = () => {
		setThumbnailImage(null)
	}
	const handleDeleteProductImage = (index: number) => {
		const updatedImages = [...productImages]
		updatedImages.splice(index, 1)
		setProductImages(updatedImages)
	}
	const handleDateChange = (date: Date | null) => {
		setExpirationDate(date)
		setValue("discountExpirationDate", date?.toISOString() || "")
	}

	const handleSubmitProduct = handleSubmit(async (data) => {
		setLoading(true)
		let hasError = false
		const formData = new FormData()
		clearErrors()

		for (let [key, value] of Object.entries(data)) {
			if (key === "price" || key === "quantity" || key === "discountValue") {
				value = Number(String(value).replace(/[^0-9]/g, ""))
			}
			formData.append(key, value)
		}
		const { description, error, removedImages, currentCloudImages } =
			await processEditorContentWithUpload(
				editorPreviewRef,
				descriptionImages // ← existing cloud URLs
			)

		// if (currentCloudImages) {
		// 	setDescriptionImages(currentCloudImages)
		// }

		if (error) {
			addError(error)
			hasError = true
		} else {
			formData.append("description", description)
		}

		// Optionally delete removed images
		if (removedImages?.length) {
			await fetch(`${API}/upload-image`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ imageUrls: removedImages }),
				credentials: "include",
			})
		}

		// ----- Handle thumbnail -----
		if (thumbnailImage) {
			if (thumbnailImage instanceof File) {
				formData.append("thumbnail", thumbnailImage)

				// delete old thumbnail if new one is uploaded
				if (
					typeof productResponse.data.thumbnail === "string" &&
					productResponse.data.thumbnail.startsWith(
						"https://res.cloudinary.com/"
					)
				) {
					await fetch(`${API}/upload-image/delete`, {
						method: "DELETE",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify({
							imageUrls: [productResponse.data.thumbnail],
						}),
						credentials: "include",
					})
				}
			} else {
				formData.append("thumbnail", thumbnailImage)
			}
		} else {
			addError("Thumbnail is required.")
			hasError = true
		}

		// ----- Handle product images -----
		if (productImages.length > 0) {
			const existingImageUrls = productImages.filter(
				(img) => typeof img === "string"
			) as string[]

			const newImageFiles = productImages.filter(
				(img) => img instanceof File
			) as File[]

			// Append new images
			newImageFiles.forEach((file) => {
				formData.append("productImages", file)
			})

			// Append kept Cloudinary URLs
			formData.append(
				"existingProductImages",
				JSON.stringify(existingImageUrls)
			)

			// 🔥 Delete removed Cloudinary images
			const originalUrls = productResponse.data.images.filter((img) =>
				img.startsWith("https://res.cloudinary.com/")
			)

			const removedProductImages = originalUrls.filter(
				(original) => !existingImageUrls.includes(original)
			)

			if (removedProductImages.length > 0) {
				await fetch(`${API}/upload-image/`, {
					method: "DELETE",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ imageUrls: removedProductImages }),
					credentials: "include",
				})
			}
		} else {
			addError("Please choose a picture for the product.")
			hasError = true
		}

		formData.append("variants", JSON.stringify(variantFields))

		if (hasError) return

		try {
			const updateProductResponse = await fetch(
				`/api/product/update/${productResponse.data._id}`,
				{
					method: "PUT",
					body: formData,
					credentials: "include",
				}
			)

			const responseData = await updateProductResponse.json()

			if (responseData.success) {
				clearErrors()
			}
		} catch (error) {
			addError("An error occurred during the update process.")
		} finally {
			setLoading(false)
		}
	})

	useEffect(() => {
		if (allowVariantsCheck && variantFields.length > 0) {
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
			setValue("quantity", quantity.toLocaleString())
		}
	}, [variantFields, allowVariants, setValue, quantity, allowVariantsCheck])

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
							required
							errorMessage={
								errors.productName &&
								(errors.productName.message?.toString() ||
									"Please enter a valid product name.")
							}
							disabled={loading}
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
							disabled={loading || allowVariants}
						/>
					</div>
					<div className="flex gap-2 mb-2">
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
								value={brand.title}
								disabled={loading}
							/>
						)}
					</div>
					{selectedCategoryData.option &&
					selectedCategoryData.option.length > 0 ? (
						<Checkbox
							label="Allow variants"
							name="allowVariants"
							checked={allowVariantsCheck} // Use the watched value
							onChange={(e) => setValue("allowVariants", e.target.checked)}
						/>
					) : (
						<div>Currently supported no variant</div>
					)}
					{allowVariantsCheck && selectedCategory && (
						<VariantOptions
							category={selectedCategory}
							variantFields={variantFields}
							setVariantFields={setVariantFields}
							categories={categories}
						/>
					)}
					<div className="flex gap-2 flex-col">
						<div className="flex items-center">
							{/* <label htmlFor="enableDiscount">Discount?</label> */}
							<Checkbox
								label="Enable discount"
								type="checkbox"
								name="enableDiscount"
								// {...register("enableDiscount")}
								checked={enableDiscountCheck} // Use the watched value
								// className="mr-2"
								onChange={(e) => setValue("enableDiscount", e.target.checked)}
							/>
						</div>
						{enableDiscountCheck && (
							<div className="flex flex-col mx-4">
								<div className="flex gap-2 mb-2">
									<Radio
										label="Percentage"
										name="discountType"
										value="percentage"
										checked={discountTypeCheck === "percentage"}
										onChange={() => setValue("discountType", "percentage")}
									/>

									<Radio
										label="Fixed"
										name="discountType"
										value="fixed"
										checked={discountTypeCheck === "fixed"}
										onChange={() => setValue("discountType", "fixed")}
									/>
								</div>
								<div className="flex gap-2 mb-2">
									<InputField
										label="Discount value"
										name="discountValue"
										register={register}
										required="Discount is required"
										validateType={"onlyNumbers"}
										errorMessage={
											errors.discountValue &&
											(errors.discountValue?.message?.toString() ||
												"Please enter a valid discount value.")
										}
										validate={(value) => {
											const discountType = getValues("discountType")
											if (value) {
												const numericValue = Number(
													String(value).replace(/[^0-9]/g, "")
												)
												if (discountType === "percentage") {
													if (numericValue < 1 || numericValue > 100) {
														return "Percentage must be between 1-100%"
													}
												}
												if (discountType === "fixed") {
													if (numericValue > price) {
														return "Fixed discount cannot exceed the original price"
													}
												}
											}
											return true
										}}
										disabled={loading}
									/>
								</div>
								<div className="flex gap-2">
									<label htmlFor="discountExpirationDate">
										Expiration date
									</label>
									<DatePicker
										selected={expirationDate}
										onChange={handleDateChange}
										dateFormat="yyyy-MM-dd"
										minDate={new Date()}
										className="input-field"
									/>
								</div>
							</div>
						)}
					</div>
					<div className="w-full px-2 my-4">
						<EditorPreviewContainer
							ref={editorPreviewRef}
							initialContent={description}
							onContentChange={(content) => (descriptionRef.current = content)}
							images={descriptionImages}
							onImageChange={setDescriptionImages}
						/>
					</div>
				</div>
				<div className="px-4">
					<h3 className="font-semibold">Thumbnail preview</h3>
					<div className="flex items-center">
						{thumbnailImage && (
							<ImagePreview
								images={[thumbnailImage]}
								onDelete={handleDeleteThumbnail}
								disabled={loading}
							/>
						)}
					</div>
					<ImageUpload onUpload={handleThumbnailUpload} />

					<h3 className="font-semibold mt-4">Product images</h3>
					<div className="lg:w-full overflow-y-auto flex flex-wrap max-h-[320px]">
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
				<div className="flex flex-col items-end gap-2">
					{/* <label htmlFor="publicProduct">Public right away?</label>
					<input type="checkbox" {...register("publicProduct")} /> */}

					<Checkbox
						label="Public right away?"
						name="publicProduct"
						checked={publicProductCheck}
						// onChange={handlePublicProduct}
						onChange={(e) => setValue("publicProduct", e.target.checked)}
					/>
					<Button
						disabled={loading}
						type="submit"
						className="w-fit bg-green-500 disabled:bg-rose-500 p-1 hover:bg-opacity-70 hover:brightness-125 duration-300 ease-in-out rounded"
					>
						Update product
					</Button>
					{errorMessages.length > 0 && (
						<ul className="text-red-500">
							{errorMessages.map((error, index) => (
								<li key={index}>{error}</li>
							))}
						</ul>
					)}
				</div>
			</form>
		</>
	)
}

export default UpdateProduct
