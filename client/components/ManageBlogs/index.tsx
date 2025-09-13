"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"
import { API } from "@/constant"
import { ApiResponse, BlogCategoryType, PopulatedBlog } from "@/types"
import Button from "../Button"
import CustomImage from "../CustomImage"
import { Modal, Pagination } from "@/components"
import Link from "next/link"
import { FaEye, FaTrash } from "@/assets/icons"
import SortControls from "./SortControl"

interface ManageBlogsProps {
	initialSearchParams: { [key: string]: string | string[] | undefined }
}

const ManageBlogs = ({ initialSearchParams }: ManageBlogsProps) => {
	const router = useRouter()
	const searchParams = useSearchParams()

	const [loading, setLoading] = useState(false)
	const [blogs, setBlogs] = useState<PopulatedBlog[]>([])
	const [pagination, setPagination] = useState({ totalPages: 1 })
	const [showDeleteModal, setShowDeleteModal] = useState(false)
	const [blogToDelete, setBlogToDelete] = useState<null | number>(null)

	// Parse search params into query string
	const buildQueryString = useCallback(() => {
		const params = new URLSearchParams()
		for (const [key, value] of Array.from(searchParams.entries())) {
			params.set(key, value)
		}
		return params.toString()
	}, [searchParams])

	const fetchBlogs = useCallback(async () => {
		setLoading(true)
		const query = buildQueryString()
		const res = await fetch(`/api/blog?${query}`, {
			credentials: "include",
			cache: "no-cache",
		})
		const data: ApiResponse<PopulatedBlog[]> = await res.json()
		if (data.success) {
			setBlogs(data.data)
			setPagination(data.pagination)
		} else {
			toast.error("Failed to fetch blogs")
		}
		setLoading(false)
	}, [buildQueryString])

	useEffect(() => {
		fetchBlogs()
	}, [fetchBlogs]) // re-fetch on query param change

	const handleDeleteBlog = async () => {
		if (!blogToDelete) return
		setLoading(true)

		const response = await fetch(`/api/blog/${blogToDelete}`, {
			method: "DELETE",
			credentials: "include",
		})
		const result = await response.json()

		if (result.success) {
			toast.success("Blog deleted successfully")
			await fetchBlogs()
		} else {
			toast.error("Failed to delete blog")
		}

		setLoading(false)
		setShowDeleteModal(false)
		setBlogToDelete(null)
	}

	return (
		<>
			<Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
				<div className="w-[300px] text-center space-y-4">
					<h3 className="text-lg font-semibold">Confirm Deletion</h3>
					<p className="text-gray-600">
						Are you sure you want to delete this blog?
					</p>
					<div className="flex justify-center gap-4">
						<Button
							type="button"
							className="bg-gray-300 text-black"
							onClick={() => setShowDeleteModal(false)}
							aria-label="Cancel blog deletion"
							role="button"
							tabIndex={0}
							data-testid="cancel-delete-blog-button"
							id="cancel-delete-blog-button"
						>
							Cancel
						</Button>
						<Button
							className="bg-red-500"
							onClick={handleDeleteBlog}
							aria-label="Confirm blog deletion"
							role="button"
							tabIndex={0}
							data-testid="confirm-delete-blog-button"
							id="confirm-delete-blog-button"
						>
							Delete
						</Button>
					</div>
				</div>
			</Modal>

			<h2 className="text-2xl font-bold mb-4 font-bebasNeue text-center">
				Blog list
			</h2>

			<div className="flex flex-wrap gap-3 items-center w-full justify-between mb-4">
				{loading ? (
					<div>Loading…</div>
				) : blogs.length === 0 ? (
					<div className="text-center w-full">Currently, there is no blog.</div>
				) : (
					<div className="flex-1">
						<div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 font-semibold text-left px-4 py-2 border-b border-gray-300 bg-gray-100 text-sm">
							<SortControls />
						</div>
						<div>
							{blogs.map((blog) => (
								<div
									key={blog._id}
									className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 items-center px-4 py-2 border-b border-gray-300 text-sm"
								>
									<div className="flex items-center gap-2 px-2 py-1">
										<div className="w-20 h-28 relative shrink-0">
											<CustomImage
												src={blog.image}
												alt={blog.title}
												fill
												className="w-full h-full object-contain rounded"
											/>
										</div>
										<span className="line-clamp-1 mx-2">{blog.title}</span>
									</div>
									<div className="line-clamp-1 px-2 py-1">
										{blog.author?.firstName} {blog.author?.lastName}
									</div>
									<div className="text-gray-500 px-2 py-1">
										{new Date(blog.createdAt).toLocaleDateString()}
									</div>
									<div className="flex items-center justify-end gap-2 px-2 py-1">
										<Link
											href={`/admin/update-blog/${blog.slug}`}
											title="View Blog"
											className="text-green-600 hover:text-green-800 hover:bg-green-300 rounded p-2"
										>
											<FaEye />
										</Link>
										<Button
											onClick={() => {
												setBlogToDelete(blog._id)
												setShowDeleteModal(true)
											}}
											className="text-red-600 hover:text-red-800 hover:bg-red-300 rounded p-2"
											aria-label={`Delete blog titled ${blog.title}`}
											role="button"
											tabIndex={0}
											data-testid={`delete-blog-button-${blog._id}`}
											id={`delete-blog-button-${blog._id}`}
										>
											<FaTrash />
										</Button>
									</div>
								</div>
							))}
						</div>
						<Pagination totalPages={pagination.totalPages} showPageInput />
					</div>
				)}
			</div>
		</>
	)
}

export default ManageBlogs
