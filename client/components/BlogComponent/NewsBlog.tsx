import {
	AiOutlineDislike,
	AiOutlineLike,
	CiClock1,
	IoEyeSharp,
	IoReaderOutline,
} from "@/assets/icons"
import { CustomImage, Pagination } from "@/components"
import { PopulatedBlog } from "@/types"
import Link from "next/link"
import React from "react"
import InnerHTML from "dangerously-set-html-content"
import { formatViews, sanitizeHTML } from "@/utils"

interface BlogData {
	success: boolean
	data: PopulatedBlog[]
	pagination: {
		totalPages: number
	}
}

const NewsBlog = ({ blogData }: { blogData: BlogData }) => {
	if (!blogData.success || blogData.data.length === 0) {
		return <p className="text-center">No blogs found.</p>
	}

	const [firstBlog, ...restBlogs] = blogData.data

	return (
		<>
			{/* 🔹 Unique First Blog */}
			<div className="mb-4 p-4 bg-white shadow rounded-lg hover:shadow-xl transition-shadow duration-300">
				<Link
					href={`/blog/${firstBlog.slug}`}
					className="block hover:brightness-110 duration-300 hover:scale-105 hover:opacity-90"
				>
					<CustomImage
						src={firstBlog.image}
						alt={firstBlog.title}
						className="object-fill rounded mb-4 right-0"
						width={280}
						height={160}
					/>
					<h2 className="text-2xl font-bold mb-2">{firstBlog.title}</h2>
				</Link>
				<div className="text-gray-700 text-base mb-2 line-clamp-4">
					<InnerHTML html={sanitizeHTML(firstBlog.description)} />
				</div>
				<Link
					href={`/blog/${firstBlog.slug}`}
					className="text-blue-600 hover:underline font-medium duration-300 transition-all hover:brightness-110 hover:opacity-90"
				>
					Read more <IoReaderOutline className="inline ml-1" />
				</Link>
			</div>

			{/* 🔹 Remaining Blogs */}
			<div className="grid grid-cols-1 gap-1 p-1">
				{restBlogs.map((blog: PopulatedBlog) => (
					<div
						key={blog._id}
						className="flex bg-white rounded shadow overflow-hidden group mb-2 flex-row hover:shadow-xl transition-shadow duration-300"
					>
						<Link href={`/blog/${blog.slug}`} className="flex-shrink-0">
							<CustomImage
								src={blog.image}
								alt={blog.title}
								className="w-[280px] h-[160px] object-cover group-hover:opacity-70 transition-all duration-300 mx-4"
								fill
							/>
						</Link>
						<div className="flex-1 px-4 py-2 flex flex-col justify-between">
							<Link
								href={`/blog/${blog.slug}`}
								className="text-blue-600 hover:underline mb-2"
							>
								<h2 className="font-bold text-xl mb-1 line-clamp-2">
									{blog.title}
								</h2>
							</Link>
							<div className="flex items-center mb-2">
								{blog.relatedBlogCategory && (
									<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
										{blog.relatedBlogCategory.title}
									</span>
								)}
							</div>
							<div className="text-gray-700 text-sm mb-2 line-clamp-3">
								<InnerHTML html={sanitizeHTML(blog.description)} />
							</div>
							<div className="flex items-center justify-between text-gray-500 text-sm"></div>
							<div className="flex items-center gap-2 text-xs opacity-80 w-full">
								<span className="flex items-center">
									<IoEyeSharp className="inline mr-1" />
									{formatViews(blog.numberViews)}
								</span>
								<span className="flex items-center">
									<CiClock1 className="inline mr-1" />
									{new Date(blog.createdAt).toLocaleDateString()}
								</span>
								<span className="flex items-center justify-end">
									<CustomImage
										src={blog.author.avatar}
										alt={blog.author.firstName + " " + blog.author.lastName}
										className="rounded-full mx-0.5"
										width={22}
										height={22}
									/>
									<span className="text-gray-600 text-xs">
										{blog.author.firstName} {blog.author.lastName}
									</span>
								</span>
							</div>
							<div className="flex items-center gap-2 justify-end text-gray-500 text-xs mt-2">
								<span className="flex items-center">
									<AiOutlineLike className="inline mr-1 text-green-500" />
									{blog.likes.length}
								</span>
								<span className="flex items-center">
									<AiOutlineDislike className="inline mr-1 text-red-500" />
									{blog.dislikes.length}
								</span>
							</div>
						</div>
					</div>
				))}
			</div>

			{/* 🔹 Pagination */}
			<div className="flex justify-center w-full mt-4">
				<Pagination totalPages={blogData.pagination.totalPages} showPageInput />
			</div>
		</>
	)
}

export default NewsBlog
