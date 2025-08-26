import { CustomImage } from "@/components"
import { PopulatedBlog } from "@/types"
import { formatViews, sanitizeHTML } from "@/utils"
import Link from "next/link"
import React from "react"
import InnerHTML from "dangerously-set-html-content"
import {
	AiOutlineDislike,
	AiOutlineLike,
	CiClock1,
	IoEyeSharp,
} from "@/assets/icons"

interface MostViewdBlogData {
	success: boolean
	data: PopulatedBlog[]
	pagination: {
		totalPages: number
	}
}

const MostViewedBlog = ({
	highestViewBlogsData,
}: {
	highestViewBlogsData: MostViewdBlogData
}) => {
	if (!highestViewBlogsData.success || highestViewBlogsData.data.length === 0) {
		return <p className="text-center">No blogs found.</p>
	}

	const [first, second, third, ...rest] = highestViewBlogsData.data

	return (
		<div className="grid grid-cols-1 xl:grid-cols-3 gap-4 p-4">
			{/* BIG BLOG */}
			<div className="xl:col-span-2 row-span-2 bg-white rounded shadow p-4 hover:shadow-lg transition-shadow duration-300">
				<Link href={`/blog/${first.slug}`} className="block hover:opacity-90">
					<CustomImage
						src={first.image}
						alt={first.title}
						className="w-full h-[300px] object-cover rounded mb-4"
						width={800}
						height={450}
					/>
					<h3 className="text-2xl font-bold mb-2 line-clamp-2">
						{first.title}
					</h3>
				</Link>
				<div className="flex items-center mb-2">
					{first.relatedBlogCategory && (
						<span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
							{first.relatedBlogCategory.title}
						</span>
					)}
				</div>
				<div className="flex text-sm text-gray-500 mb-2 gap-2">
					<span className="flex items-center">
						<CiClock1 className="inline mr-0.5" />
						{new Date(first.createdAt).toLocaleDateString()}
					</span>
					<span className="flex items-center">
						<IoEyeSharp className="inline mr-0.5" />
						{formatViews(first.numberViews)}
					</span>
					<span className="flex items-center">
						{first.author.firstName} {first.author.lastName}
					</span>
				</div>
				<div className="text-gray-700 line-clamp-5">
					<InnerHTML html={sanitizeHTML(first.description)} />
				</div>
				<div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
					<Link href={`/blog/${first.slug}`}>
						<button className="p-1 border-2 border-black rounded text-sm hover:bg-black hover:text-white duration-300 ease-in-out font-bold">
							Read more
						</button>
					</Link>
					<span className="flex items-center ml-auto">
						<AiOutlineLike className="inline mr-1 text-green-500" />
						{first.likes.length}
					</span>
					<span className="flex items-center">
						<AiOutlineDislike className="inline mr-1 text-red-500" />
						{first.dislikes.length}
					</span>
				</div>
			</div>

			{/* SECOND BLOG */}
			{second && third && (
				<>
					<div className="bg-white rounded shadow p-2 hover:shadow-lg transition-shadow duration-300">
						<Link
							href={`/blog/${second.slug}`}
							className="block hover:opacity-90"
						>
							<CustomImage
								src={second.image}
								alt={second.title}
								className="w-full h-[300px] xl:h-[150px] object-cover rounded mb-2"
								width={400}
								height={200}
							/>
							<h3 className="text-lg font-semibold mb-1 line-clamp-2">
								{second.title}
							</h3>
						</Link>
						<p className="text-sm text-gray-500 mb-1">
							<span>{new Date(second.createdAt).toLocaleDateString()}</span>
							<span className="mx-0.5">•</span>
							<span>
								{second.author.firstName} {second.author.lastName}
							</span>
						</p>
						<p className="text-gray-700 text-sm line-clamp-4 lg:line-clamp-2">
							<InnerHTML html={sanitizeHTML(second.description)} />
						</p>
					</div>

					<div className="bg-white rounded shadow p-2 hover:shadow-lg transition-shadow duration-300">
						<Link
							href={`/blog/${third.slug}`}
							className="block hover:opacity-90"
						>
							<CustomImage
								src={third.image}
								alt={third.title}
								className="w-full h-[300px] xl:h-[150px] object-cover rounded mb-2"
								width={400}
								height={200}
							/>
							<h3 className="text-lg font-semibold mb-1 line-clamp-4 lg:line-clamp-2">
								{third.title}
							</h3>
						</Link>
						<p className="text-sm text-gray-500 mb-1">
							<span>{new Date(third.createdAt).toLocaleDateString()}</span>
							<span className="mx-0.5">•</span>
							<span>
								{third.author.firstName} {third.author.lastName}
							</span>
						</p>
						<p className="text-gray-700 text-sm line-clamp-2">
							<InnerHTML html={sanitizeHTML(third.description)} />
						</p>
					</div>
				</>
			)}

			{/* GRID OF REMAINING BLOGS */}
			<div className="xl:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
				{rest.map((blog) => (
					<div
						key={blog._id}
						className="bg-white rounded shadow p-4 hover:shadow-lg transition-all duration-300"
					>
						<Link
							href={`/blog/${blog.slug}`}
							className="block hover:opacity-90 duration-300 transition-all"
						>
							<CustomImage
								src={blog.image}
								alt={blog.title}
								className="w-full h-[150px] object-cover rounded mb-2"
								width={300}
								height={180}
							/>
							<h3 className="text-base font-medium mb-1 line-clamp-2">
								{blog.title}
							</h3>
						</Link>
					</div>
				))}
			</div>
		</div>
	)
}

export default MostViewedBlog
