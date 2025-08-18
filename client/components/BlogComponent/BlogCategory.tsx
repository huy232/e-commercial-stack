import { CustomImage } from "@/components"
import { sanitizeHTML } from "@/utils"
import Link from "next/link"
import React from "react"

interface BlogCategoryData {
	success: boolean
	data: {
		_id: string
		title: string
		slug: string
		description: string
		image: string
		createdAt: string
		updatedAt: string
	}[]
	pagination: {
		totalPages: number
	}
}

const BlogCategory = ({
	blogCategoryData,
}: {
	blogCategoryData: BlogCategoryData
}) => {
	return (
		<>
			{blogCategoryData.success && blogCategoryData.data.length > 0 ? (
				<div className="grid grid-cols-1 gap-4 p-1">
					{blogCategoryData.data.map((blog) => (
						<Link
							href={`/blog/${blog.slug}`}
							key={blog._id}
							className="rounded shadow p-1 hover:shadow-lg duration-300 flex items-center justify-end gap-2 hover:brightness-110 hover:opacity-80 transition-all"
							aria-label={`Blog: ${blog.title}`}
						>
							<CustomImage
								src={blog.image}
								alt={blog.title}
								className="object-cover"
								width={50}
								height={25}
							/>
							<h2 className="text-sm font-bold line-clamp-2 w-[70%]">
								{blog.title}
							</h2>
						</Link>
					))}
				</div>
			) : (
				<p className="text-gray-500 p-4">No categories found.</p>
			)}
		</>
	)
}

export default BlogCategory
