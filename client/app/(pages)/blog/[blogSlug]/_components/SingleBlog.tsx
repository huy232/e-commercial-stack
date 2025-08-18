"use client"
import { AiOutlineDislike, AiOutlineLike, IoEyeSharp } from "@/assets/icons"
import { formatViews } from "@/utils"
import Link from "next/link"
import React, { useState } from "react"
import InnerHTML from "dangerously-set-html-content"
import { CustomImage, Modal } from "@/components"
import { selectAuthUser } from "@/store/slices/authSlice"
import { useSelector } from "react-redux"
import { useRouter } from "next/navigation"
import { API } from "@/constant"

interface SingleBlogProps {
	blogPostData: {
		data: {
			_id: string
			title: string
			image: string
			description: string
			createdAt: string
			author: {
				firstName: string
				lastName: string
			}
			relatedBlogCategory: {
				slug: string
				title: string
			} | null
			numberViews: number
			likes: number
			dislikes: number
			alreadyLiked: boolean
			alreadyDisliked: boolean
		}
	}
}

const SingleBlog = ({ blogPostData }: SingleBlogProps) => {
	const router = useRouter()
	const user = useSelector(selectAuthUser)
	const [showModal, setShowModal] = useState(false)
	const [likes, setLikes] = useState(blogPostData.data.likes)
	const [dislikes, setDislikes] = useState(blogPostData.data.dislikes)
	const [alreadyLiked, setAlreadyLiked] = useState(
		blogPostData.data.alreadyLiked
	)
	const [alreadyDisliked, setAlreadyDisliked] = useState(
		blogPostData.data.alreadyDisliked
	)

	const handleAction = async (type: "like" | "dislike") => {
		if (!user) {
			setShowModal(true)
			return
		}
		try {
			const res = await fetch(
				API + `/blog/blog-like/${blogPostData.data._id}`,
				{
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ action: type }),
				}
			)
			const result = await res.json()
			if (result.success) {
				setLikes(result.data.likes)
				setDislikes(result.data.dislikes)
				setAlreadyLiked(result.data.alreadyLiked)
				setAlreadyDisliked(result.data.alreadyDisliked)
			}
		} catch (err) {
			console.error("Like/Dislike error:", err)
		}
	}

	return (
		<>
			{blogPostData && (
				<div className="col-span-12 lg:col-span-8 p-4">
					<h1 className="text-3xl font-bold mb-2 font-bebasNeue text-gray-800">
						{blogPostData.data.title}
					</h1>
					<CustomImage
						src={blogPostData.data.image}
						alt={blogPostData.data.title}
						className="h-[260px] w-auto justify-self-center object-cover rounded mb-4 text-center"
						fill
					/>
					<div className="text-gray-700 text-base mb-2">
						<InnerHTML html={blogPostData.data.description} />
					</div>
					<div className="text-sm text-gray-500">
						<span className="mr-2 font-semibold">
							{new Date(blogPostData.data.createdAt).toLocaleDateString()}
						</span>
						<span>
							by{" "}
							{blogPostData.data.author.firstName +
								" " +
								blogPostData.data.author.lastName}
						</span>
					</div>
					<p className="text-gray-500 text-sm my-1">
						<span className="mr-1 text-sm font-semibold">Category</span>
						{blogPostData.data.relatedBlogCategory ? (
							<Link
								href={`/blog?category=${blogPostData.data.relatedBlogCategory.slug}#newest-blogs`}
								className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2 hover:bg-blue-200 transition-colors duration-200"
							>
								{blogPostData.data.relatedBlogCategory.title}
							</Link>
						) : (
							<span className="text-gray-500">No category assigned</span>
						)}
					</p>

					<div className="flex items-center justify-end text-gray-600 gap-4 mt-3 text-sm">
						<span className="flex items-center gap-1">
							<IoEyeSharp />
							{formatViews(blogPostData.data.numberViews)}
						</span>
						<button
							className={`flex items-center gap-1 ${
								alreadyLiked ? "text-green-600" : ""
							}`}
							onClick={() => handleAction("like")}
						>
							<AiOutlineLike />
							{likes}
						</button>
						<button
							className={`flex items-center gap-1 ${
								alreadyDisliked ? "text-red-600" : ""
							}`}
							onClick={() => handleAction("dislike")}
						>
							<AiOutlineDislike />
							{dislikes}
						</button>
					</div>
				</div>
			)}

			{showModal && (
				<Modal isOpen={showModal} onClose={() => setShowModal(false)}>
					<div className="text-sm text-gray-700 p-4">
						<p>You need to be logged in to like or dislike.</p>
						<div className="mt-4 flex justify-end gap-2">
							<button
								className="px-4 py-2 bg-gray-200 rounded"
								onClick={() => setShowModal(false)}
							>
								Continue as Guest
							</button>
							<button
								className="px-4 py-2 bg-blue-600 text-white rounded"
								onClick={() => router.push("/login")}
							>
								Login
							</button>
						</div>
					</div>
				</Modal>
			)}
		</>
	)
}

export default SingleBlog
