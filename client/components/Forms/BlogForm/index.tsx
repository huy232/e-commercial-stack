"use client"
import { useForm } from "react-hook-form"
import { useCallback, useEffect, useRef, useState } from "react"
import {
	Button,
	CustomImage,
	EditorPreviewContainer,
	GenericSearchBar,
	ImagePreview,
	ImageUpload,
	InputField,
} from "@/components"
import { API } from "@/constant"
import {
	ApiProductCategoryResponse,
	ApiProductResponse,
	Blog,
	BlogCategoryType,
	CategoryType,
	ProductExtraType,
	Users,
} from "@/types"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
	arraysAreEqual,
	extractImageUrlsFromHTML,
	processEditorContentWithUpload,
} from "@/utils"
import { toast } from "react-toastify"

type BlogFormValues = {
	title: string
	description: string
	image: string
	category: string
	author: string
	relatedProducts: string[]
	blogCategory?: string
	relatedBlogCategory?: string
}

type BlogFormProps = {
	onSubmit: (data: BlogFormValues) => void
	defaultValues?: BlogFormValues
	isLoading?: boolean
	submitText?: string
	products?: ApiProductResponse<ProductExtraType[]>
	categories?: ApiProductCategoryResponse<CategoryType[]>
	user: Users
	blogCategories: BlogCategoryType[]
	mode: string
}

function extractIds(input: unknown): string[] {
	if (!Array.isArray(input)) return []
	return input
		.map((item) =>
			typeof item === "string"
				? item
				: typeof item === "object" && item !== null && "_id" in item
				? (item as any)._id
				: ""
		)
		.filter(Boolean)
}

export default function BlogForm({
	onSubmit,
	defaultValues,
	isLoading = false,
	submitText = "Submit",
	products,
	categories,
	user,
	blogCategories,
	mode,
}: BlogFormProps) {
	const {
		register,
		handleSubmit,
		setValue,
		getValues,
		formState: { errors },
		watch,
		reset,
	} = useForm<BlogFormValues>({
		defaultValues: {
			...defaultValues,
			relatedProducts: extractIds(defaultValues?.relatedProducts) || [],
		},
	})

	const [images, setImagesState] = useState<string[]>(
		extractImageUrlsFromHTML(defaultValues?.description || "") || []
	)
	const setImages = useCallback((newImages: string[]) => {
		setImagesState((prevImages) => {
			if (arraysAreEqual(prevImages, newImages)) return prevImages
			return newImages
		})
	}, [])
	const relatedProducts = watch("relatedProducts") || []
	const editorPreviewRef = useRef<{
		clear: () => void
		getContent: () => string
		getLocalImages: () => string[]
	} | null>(null)
	const [thumbnail, setThumbnail] = useState<File | string | null>(
		defaultValues?.image || null
	)
	const [thumbnailError, setThumbnailError] = useState<string>("")
	const [uploading, setUploading] = useState(false)
	const [showRelatedProducts, setShowRelatedProducts] = useState(
		defaultValues?.relatedProducts?.length ? true : false
	)
	const [selectedRelatedProducts, setSelectedRelatedProducts] = useState<
		ProductExtraType[]
	>(() => {
		const ids = (defaultValues?.relatedProducts ?? []).map((p: any) =>
			typeof p === "string" ? p : p._id
		)
		const matched =
			products?.data.filter((product) => ids.includes(product._id)) || []
		return matched
	})

	const router = useRouter()
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const params = new URLSearchParams(searchParams.toString())

	const totalPages = products?.totalPages ?? 1
	const currentPage = Number(searchParams.get("page")) || 1

	const handlePageChange = (page: number) => {
		const clampedPage = Math.max(1, Math.min(page, totalPages))
		params.set("page", clampedPage.toString())
		// router.push(`?${params.toString()}`)
		router.replace(`${pathname}?${params.toString()}`)
	}

	const handleToggleRelatedProducts = () => {
		setShowRelatedProducts((prev) => {
			const next = !prev
			if (!next) {
				setValue("category", "")
				setValue("relatedProducts", [])
				setSelectedRelatedProducts([])
				params.delete("category")
				params.delete("page")
				router.replace(`${pathname}?${params.toString()}`)
			}
			return next
		})
	}

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const value = e.target.value
		setValue("category", value)

		if (value) {
			params.set("category", value)
			params.set("page", "1")
		} else {
			params.delete("category")
			params.delete("page")
		}
		router.replace(`${pathname}?${params.toString()}`)
	}

	const submitHandler = async (data: BlogFormValues) => {
		setUploading(true)
		// Track uploaded Cloudinary images
		let uploadedImagesToCleanup: string[] = []
		try {
			let imageUrl = typeof thumbnail === "string" ? thumbnail : null
			if (thumbnail instanceof File) {
				const formData = new FormData()
				formData.append("image", thumbnail)
				const res = await fetch(`${API}/upload-image/single-image`, {
					method: "POST",
					body: formData,
					credentials: "include",
				})
				const resData = await res.json()
				imageUrl = resData.image
				// Track for cleanup if later steps fail
				if (imageUrl && imageUrl.startsWith("https://res.cloudinary.com/")) {
					uploadedImagesToCleanup.push(imageUrl)
				}
			}
			const { description, error, removedImages, currentCloudImages } =
				await processEditorContentWithUpload(editorPreviewRef, images)
			if (error) {
				toast.error(`Editor processing error: ${error}`)
				throw new Error(error) // Will be caught below
			}
			if (currentCloudImages) {
				setImages(currentCloudImages)
				uploadedImagesToCleanup.push(...currentCloudImages)
			}
			// Delete removed images now (these are confirmed deletions)
			if (removedImages && removedImages.length > 0) {
				await fetch(`${API}/upload-image/delete`, {
					method: "POST",
					credentials: "include",
					body: JSON.stringify({ imageUrls: removedImages }),
					headers: { "Content-Type": "application/json" },
				})
			}
			onSubmit({
				...data,
				author: user._id,
				image: imageUrl || "",
				description,
				relatedProducts: selectedRelatedProducts.map((p) => p._id),
				relatedBlogCategory: data.relatedBlogCategory || "",
			})

			if (mode === "create") {
				// Reset form fields
				reset({
					title: "",
					description: "",
					category: "",
					relatedProducts: [],
					relatedBlogCategory: "",
				})

				// Reset thumbnail and other stateful fields
				setThumbnail(null)
				setThumbnailError("")
				editorPreviewRef.current?.clear()
				setImages([])
				setSelectedRelatedProducts([])
				setShowRelatedProducts(false)

				// Clear URL params (remove category & page)
				params.delete("category")
				params.delete("page")
				router.replace(`${pathname}?${params.toString()}`)
			}
		} catch (error) {
			toast.error(`Error submitting form: ${error}`)
			// ❌ Cleanup uploaded Cloudinary images if submission failed
			if (uploadedImagesToCleanup.length > 0) {
				await fetch(`${API}/upload-image/delete`, {
					method: "POST",
					credentials: "include",
					body: JSON.stringify({ imageUrls: uploadedImagesToCleanup }),
					headers: { "Content-Type": "application/json" },
				})
			}
		} finally {
			setUploading(false)
		}
	}
	const handleDeleteThumbnail = () => {
		setThumbnail(null)
	}

	const handleThumbnailUpload = (files: File[]) => {
		if (files.length > 0) {
			setThumbnail(files[0])
			setThumbnailError("")
		}
	}

	const handleRelatedProductChange = (id: string) => {
		const currentIds = getValues("relatedProducts") || []
		const exists = currentIds.includes(id)

		let updatedIds: string[]
		if (exists) {
			updatedIds = currentIds.filter((pid) => pid !== id)
		} else {
			updatedIds = [...currentIds, id]
		}

		// Combine old + newly found products
		const newlySelected =
			products?.data.filter(
				(p) =>
					updatedIds.includes(p._id) &&
					!selectedRelatedProducts.some((sp) => sp._id === p._id)
			) || []

		const stillSelected = selectedRelatedProducts.filter((p) =>
			updatedIds.includes(p._id)
		)

		setValue("relatedProducts", updatedIds)
		setSelectedRelatedProducts([...stillSelected, ...newlySelected])
	}

	useEffect(() => {
		if (!showRelatedProducts) {
			setValue("relatedProducts", [])
		}
	}, [showRelatedProducts, setValue])

	return (
		<form
			onSubmit={handleSubmit(submitHandler)}
			className="w-full grid grid-cols-2 gap-4"
		>
			<div className="bg-neutral-400 bg-opacity-50 rounded py-1 px-3 mt-2 mb-6 inline-block h-fit">
				<InputField
					label="Title"
					name="title"
					register={register}
					required="Title is required"
					errorMessage={errors.title?.message}
					inputAdditionalClass="w-full"
				/>

				<div className="mt-4">
					<label className="block font-semibold mb-1">Description</label>
					<EditorPreviewContainer
						ref={editorPreviewRef}
						initialContent={defaultValues?.description || ""}
						images={images}
						onImageChange={setImages}
					/>
				</div>
			</div>

			<div className="space-y-4">
				<div className="flex flex-col gap-2 mt-4">
					<label htmlFor="blog-category" className="font-semibold">
						(Optional) Select blog category
					</label>
					<select
						{...register("relatedBlogCategory")}
						className="w-[240px] border border-gray-300 p-2 rounded"
						id="blog-category"
						disabled={!blogCategories || blogCategories.length === 0}
					>
						<option value="">None</option>
						{blogCategories.map((cat) => (
							<option key={cat._id} value={cat._id}>
								{cat.title}
							</option>
						))}
					</select>
					{errors.category && (
						<p className="text-red-500 text-sm mt-1">
							{errors.category.message}
						</p>
					)}
				</div>
				<div className="flex items-center gap-2 mt-4">
					<label htmlFor="related-products" className="font-semibold">
						Enable Related Products
					</label>
					<input
						id="related-products"
						type="checkbox"
						checked={showRelatedProducts}
						onChange={handleToggleRelatedProducts}
						className="scale-125"
					/>
				</div>
				{showRelatedProducts && (
					<>
						<GenericSearchBar
							searchKey="search"
							placeholder="Search for products to link"
							label="Search products"
							disableFormWrapper
						/>
						<div className="mt-4">
							<label className="block font-semibold mb-1">Category</label>
							<select
								{...register("category")}
								value={getValues("category")}
								onChange={handleCategoryChange}
								className="w-full border border-gray-300 p-2 rounded"
							>
								<option value="">All</option>
								{categories?.data.map((cat) => (
									<option key={cat._id} value={cat.slug}>
										{cat.title}
									</option>
								))}
							</select>
							{errors.category && (
								<p className="text-red-500 text-sm mt-1">
									{errors.category.message}
								</p>
							)}
						</div>

						<div className="mt-4">
							<h3 className="font-semibold mb-1">Select Related Products</h3>
							<div className="max-h-[200px] overflow-y-auto border p-2 rounded bg-white">
								{products?.data.map((product) => {
									const checked = relatedProducts.includes(product._id)

									return (
										<label
											key={product._id}
											className="text-sm cursor-pointer flex items-center gap-2 p-2 border-b hover:bg-gray-100"
										>
											<input
												type="checkbox"
												className="mr-2"
												checked={checked}
												onChange={() => handleRelatedProductChange(product._id)}
											/>
											<div className="flex items-center gap-2">
												<CustomImage
													alt={product.title}
													src={product.thumbnail}
													fill
													className="w-[60px] h-[60px]"
												/>
												<span>{product.title}</span>
											</div>
										</label>
									)
								})}
							</div>
							{products && products?.data.length > 0 && (
								<div className="mt-4 flex items-center gap-2">
									<Button
										type="button"
										className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
										disabled={currentPage <= 1}
										onClick={() => handlePageChange(currentPage - 1)}
										aria-label="Previous Page"
										loading={isLoading}
										role="button"
										tabIndex={0}
										data-testid="previous-page-button"
										id="previous-page-button"
									>
										Previous
									</Button>

									<span className="text-sm">
										<select
											value={currentPage}
											onChange={(e) => handlePageChange(Number(e.target.value))}
											className="border rounded px-2 py-1"
										>
											{Array.from({ length: totalPages }, (_, i) => i + 1).map(
												(page) => (
													<option key={page} value={page}>
														Page {page}
													</option>
												)
											)}
										</select>
										of {totalPages}
									</span>

									<Button
										type="button"
										className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
										disabled={currentPage >= totalPages}
										onClick={() => handlePageChange(currentPage + 1)}
										aria-label="Next Page"
										loading={isLoading}
										role="button"
										tabIndex={0}
										data-testid="next-page-button"
										id="next-page-button"
									>
										Next
									</Button>
								</div>
							)}
						</div>
					</>
				)}
				{relatedProducts.length > 0 && (
					<div className="mt-6">
						<h3 className="font-semibold mb-2">Selected Related Products</h3>
						<div className="flex flex-wrap gap-4">
							{relatedProducts.map((relatedProduct) => {
								const product = selectedRelatedProducts.find(
									(p) => p._id === relatedProduct
								)
								if (!product) return null
								return (
									<div
										key={product._id}
										className="relative w-[120px] flex flex-col items-center text-center p-2 border rounded bg-white shadow"
									>
										<CustomImage
											alt={product.title}
											src={product.thumbnail}
											fill
											className="w-[60px] h-[60px]"
										/>
										<span className="text-sm mt-2 line-clamp-2">
											{product.title}
										</span>
										<Button
											type="button"
											className="absolute top-1 right-1 text-red-500 hover:text-red-700"
											onClick={() => handleRelatedProductChange(product._id)}
											aria-label={`Remove ${product.title}`}
											role="button"
											tabIndex={0}
											data-testid={`remove-${product._id}-button`}
											id={`remove-${product._id}-button`}
											loading={isLoading}
											disabled={isLoading}
										>
											&times;
										</Button>
									</div>
								)
							})}
						</div>
					</div>
				)}

				<div>
					<h3 className="font-semibold">Thumbnail preview</h3>
					{thumbnail && (
						<div className="flex items-center mb-2">
							<ImagePreview
								images={[
									typeof thumbnail === "string"
										? thumbnail
										: URL.createObjectURL(thumbnail),
								]}
								onDelete={handleDeleteThumbnail}
							/>
						</div>
					)}
					<ImageUpload onUpload={handleThumbnailUpload} />
				</div>
			</div>

			<div className="flex flex-col items-end gap-2">
				<Button
					type="submit"
					className="custom-button w-fit bg-rose-500 p-1 hover:bg-opacity-70 hover:brightness-125 duration-300 ease-in-out rounded"
					disabled={isLoading || uploading}
					loading={isLoading || uploading}
					aria-label="Submit Blog Form"
					role="button"
					tabIndex={0}
					data-testid="submit-blog-form-button"
					id="submit-blog-form-button"
				>
					{isLoading || uploading ? "Processing..." : submitText}
				</Button>
			</div>
		</form>
	)
}
