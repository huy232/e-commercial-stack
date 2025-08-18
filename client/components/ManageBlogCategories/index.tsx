"use client"

import { useForm } from "react-hook-form"
import InputField from "../InputField"
import Button from "../Button"
import { API, BASE_SERVER_URL } from "@/constant"
import { FC, useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"
import { BlogCategoryType } from "@/types"

let socket: Socket | null = null

const ManageBlogCategories: FC = () => {
	const {
		register,
		reset,
		handleSubmit,
		formState: { errors },
		setValue,
		setError, // Add setError from useForm
		clearErrors,
	} = useForm({
		defaultValues: {
			blogCategory: "",
		},
	})

	const [loading, setLoading] = useState(true)
	const [blogCategories, setBlogCategories] = useState<
		{ _id: string; title: string }[]
	>([])

	const handleSubmitBrand = handleSubmit(async (data) => {
		clearErrors("blogCategory") // Clear any previous errors before making a new request
		const blogCategoryResponse = await fetch(API + "/blog-category", {
			method: "POST",
			body: JSON.stringify({ title: data.blogCategory }),
			credentials: "include",
			headers: { "Content-Type": "application/json" },
		})
		const blogCategory = await blogCategoryResponse.json()

		if (blogCategory.success) {
			reset({ blogCategory: "" })
			setValue("blogCategory", "")
		} else {
			// Use setError to display the server error message
			setError("blogCategory", {
				type: "server",
				message:
					blogCategory.message ||
					"An error occurred while creating blog category.",
			})
		}
	})

	useEffect(() => {
		const fetchBlogCategories = async () => {
			setLoading(true)
			const blogCategoriesResponse = await fetch(API + "/blog-category", {
				method: "GET",
				credentials: "include",
			})
			const blogCategories = await blogCategoriesResponse.json()
			if (blogCategories.success) {
				setBlogCategories(blogCategories.data)
			}
			setLoading(false)
		}
		fetchBlogCategories()
		if (!socket) {
			socket = io(BASE_SERVER_URL as string, {
				withCredentials: true,
			})

			socket.on("blogCategoriesUpdate", async () => {
				await fetchBlogCategories()
			})
		}

		return () => {
			if (socket) {
				socket.off("blogCategoriesUpdate")
				socket.disconnect()
				socket = null
			}
		}
	}, [])

	return (
		<>
			<form
				onSubmit={handleSubmitBrand}
				// className="w-full lg:w-[480px] flex flex-col space-y-4 mb-2 mx-4 lg:mx-6"
				className="lg:w-[480px] mx-4"
			>
				<h2 className="text-xl font-bold font-bebasNeue">
					Create blog category
				</h2>
				<div className="flex flex-row items-center justify-between">
					<InputField
						name="blogCategory"
						register={register}
						required="Blog category name is required"
						errorMessage={
							errors.blogCategory &&
							(errors.blogCategory.message?.toString() ||
								"Please enter a valid blog category name.")
						}
						placeholder={"Blog category name"}
					/>
					<Button
						type="submit"
						className="bg-rose-500 p-1 rounded hover:brightness-125 hover:opacity-90 duration-300 ease-in-out text-white hover:bg-transparent hover:border-rose-500 border-transparent border-[2px] hover:text-black w-[120px] mx-2"
					>
						Submit
					</Button>
				</div>
			</form>

			<h2 className="text-2xl font-bold mb-4 font-bebasNeue text-center">
				Available blog category list
			</h2>
			<div className="flex flex-wrap flex-row gap-3 items-center flex-inline mx-4">
				{!loading && blogCategories ? (
					blogCategories.map((blogCategory) => (
						<div
							className="bg-black/40 rounded p-1 text-base font-inter w-fit"
							key={blogCategory._id}
						>
							{blogCategory.title}
						</div>
					))
				) : (
					<div>Loading</div>
				)}
			</div>
		</>
	)
}

export default ManageBlogCategories
