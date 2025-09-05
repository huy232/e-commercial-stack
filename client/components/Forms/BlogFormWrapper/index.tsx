"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "react-toastify"
import BlogForm from "@/components/Forms/BlogForm"
import { API } from "@/constant"
import {
	ApiProductCategoryResponse,
	ApiProductResponse,
	CategoryType,
	ProductExtraType,
} from "@/types"
import { useSelector } from "react-redux"
import { selectAuthUser } from "@/store/slices/authSlice"
import { BlogCategoryType } from "../../../types/blogCategory"

type BlogFormWrapperProps = {
	mode: "create" | "update"
	products: ApiProductResponse<ProductExtraType[]>
	categories: ApiProductCategoryResponse<CategoryType[]>
	defaultValues?: any
	blogId?: string
	blogCategories: BlogCategoryType[]
}
export default function BlogFormWrapper({
	mode,
	products,
	categories,
	defaultValues,
	blogId,
	blogCategories,
}: BlogFormWrapperProps) {
	const user = useSelector(selectAuthUser)
	const [isLoading, setIsLoading] = useState(false)
	const handleSubmit = async (data: any) => {
		setIsLoading(true)

		try {
			const endpoint = mode === "create" ? `/api/blog` : `/api/blog/${blogId}`
			const method = mode === "create" ? "POST" : "PUT"

			const res = await fetch(endpoint, {
				method,
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(data),
			})

			if (!res.ok) {
				const errorBody = await res.json()
				throw new Error(errorBody?.message || `${mode} blog failed`)
			}

			toast.success(
				mode === "create"
					? "Blog created successfully!"
					: "Blog updated successfully!"
			)
		} catch (err) {
			if (err instanceof Error) {
				toast.error(`Failed to ${mode} blog: ${err.message}`)
				console.error(err)
				throw err
			} else {
				toast.error(`Failed to ${mode} blog: ${String(err)}`)
				console.error(err)
				throw new Error(String(err))
			}
			// ✅ Rethrow so BlogForm can catch it
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<BlogForm
			onSubmit={handleSubmit}
			isLoading={isLoading}
			submitText={mode === "create" ? "Create Blog" : "Update Blog"}
			defaultValues={defaultValues}
			// optional: pass products
			products={products}
			categories={categories}
			user={user}
			blogCategories={blogCategories}
			mode={mode}
		/>
	)
}
