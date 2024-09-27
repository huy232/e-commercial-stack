"use client"
import { SubmitHandler, useForm } from "react-hook-form"
import { InputField, Button } from "@/components"
import { FC } from "react"
import { API } from "@/constant"

const CategoryForm: FC = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
		setValue,
	} = useForm({
		defaultValues: {
			category: "",
		},
	})

	const handleSubmitProductCategory = handleSubmit(async (data) => {
		const productCategoryResponse = await fetch(API + "/product-category", {
			method: "POST",
			body: JSON.stringify({ title: data.category }),
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})
		const brand = await productCategoryResponse.json()
		if (brand.success) {
			reset({ category: "" })
			setValue("category", "")
		}
	})

	return (
		<form
			onSubmit={handleSubmitProductCategory}
			className="w-full flex flex-col space-y-4 mb-8"
		>
			<h2 className="text-xl font-bold">Create category</h2>
			<InputField
				name="category"
				register={register}
				label="Category name"
				required="Category name is required"
				errorMessage={
					errors.category &&
					(errors.category.message?.toString() ||
						"Please enter a valid category name.")
				}
			/>
			<Button type="submit">Submit</Button>
		</form>
	)
}

export default CategoryForm
