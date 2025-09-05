"use client"
import { SubmitHandler, useForm } from "react-hook-form"
import { InputField, Button, CustomImage } from "@/components"
import { FC, useState } from "react"
import { API } from "@/constant"

interface FormValues {
	category: string
	image: FileList
}

const CategoryForm: FC = () => {
	const [uploading, setUploading] = useState(false)
	const [previewUrl, setPreviewUrl] = useState<string | null>(null)
	const [selectedFile, setSelectedFile] = useState<File | null>(null)

	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
		setValue,
		watch,
	} = useForm<FormValues>({
		defaultValues: {
			category: "",
		},
	})

	const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0]
		if (file) {
			setSelectedFile(file)
			setPreviewUrl(URL.createObjectURL(file))
		}
	}

	const removeImage = () => {
		setSelectedFile(null)
		setPreviewUrl(null)
		setValue("image", undefined as any) // clears file input
	}

	const handleSubmitProductCategory = handleSubmit(async (data) => {
		let imageUrl = ""

		if (selectedFile) {
			const formData = new FormData()
			formData.append("image", selectedFile)
			setUploading(true)
			const imageRes = await fetch(`${API}/upload-image/single-image`, {
				method: "POST",
				credentials: "include",
				body: formData,
			})
			const imageData = await imageRes.json()
			setUploading(false)
			if (imageData.success) {
				imageUrl = imageData.image
			} else {
				alert("Image upload failed")
				return
			}
		}

		const productCategoryResponse = await fetch("/api/product-category", {
			method: "POST",
			body: JSON.stringify({
				title: data.category,
				image: imageUrl,
			}),
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})

		const category = await productCategoryResponse.json()
		if (category.success) {
			reset({ category: "", image: undefined })
			removeImage()
		}
	})

	return (
		<form
			onSubmit={handleSubmitProductCategory}
			className="lg:w-[480px] space-y-4"
		>
			<h2 className="mx-2 text-xl font-bold font-bebasNeue">Create category</h2>

			<div className="flex flex-col gap-2 mx-2">
				<InputField
					name="category"
					register={register}
					required="Category name is required"
					errorMessage={errors.category?.message}
					placeholder={"Category name"}
					inputAdditionalClass="field-sizing-content"
				/>

				<input
					type="file"
					accept="image/*"
					className="text-sm file:mr-4 file:py-2 file:px-4 file:border-0 file:text-sm file:font-semibold file:bg-rose-50 file:text-rose-700 hover:file:bg-rose-100 rounded file:cursor-pointer file:transition-all file:duration-300 file:ease-in-out file:hover:bg-rose-200 file:hover:text-rose-800"
					{...register("image", {
						required: "Image is required",
						onChange: handleImageChange,
					})}
				/>

				{previewUrl && (
					<div className="w-full max-w-xs border rounded p-2 relative group">
						<CustomImage
							src={previewUrl}
							alt="Preview"
							className="w-[220px] h-[220px] object-contain mx-auto"
							fill
						/>
						<button
							type="button"
							onClick={removeImage}
							className="absolute top-1 right-1 bg-white text-red-600 border border-red-600 px-2 py-0.5 rounded text-xs hover:bg-red-600 hover:text-white transition-all duration-300 ease-in-out group-hover:opacity-100 opacity-0 z-10"
						>
							Remove
						</button>
					</div>
				)}

				<Button
					className="bg-rose-500 p-1 rounded hover:brightness-125 hover:opacity-90 duration-300 ease-in-out text-white hover:bg-transparent hover:border-rose-500 border-[2px] hover:text-black w-fit lg:w-[120px]"
					type="submit"
					disabled={uploading}
				>
					{uploading ? "Uploading..." : "Submit"}
				</Button>
			</div>
		</form>
	)
}

export default CategoryForm
