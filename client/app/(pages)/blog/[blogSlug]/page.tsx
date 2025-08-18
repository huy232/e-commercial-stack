import { API } from "@/constant"
import BlogCategory from "../_components/BlogCategory"
import { CustomImage } from "@/components"
import InnerHTML from "dangerously-set-html-content"
import { FaBoltLightning, FaReadme, GrTechnology } from "@/assets/icons"
import Link from "next/link"
import SingleBlog from "./_components/SingleBlog"
import { cookies } from "next/headers"
import { Metadata } from "next"

type Props = {
	params: { blogSlug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}
interface BlogCategoryData {
	_id: string
	title: string
	slug: string
	description: string
	image: string
	createdAt: string
	updatedAt: string
}

// Dynamic Metadata
export async function generateMetadata({
	params,
}: {
	params: { blogSlug: string }
}): Promise<Metadata> {
	const { blogSlug } = params

	// Send cookies for authenticated blogs if necessary
	const cookieStore = cookies()
	const accessToken = cookieStore.get("accessToken")?.value
	const refreshToken = cookieStore.get("refreshToken")?.value
	const cookieHeader = [
		accessToken ? `accessToken=${accessToken}` : "",
		refreshToken ? `refreshToken=${refreshToken}` : "",
	]
		.filter(Boolean)
		.join("; ")

	// Fetch blog data
	const blogPost = await fetch(`${API}/blog/get-blog/${blogSlug}`, {
		method: "GET",
		headers: {
			Cookie: cookieHeader,
		},
		cache: "no-cache",
	})
	const blogData = await blogPost.json()

	if (!blogData.success || !blogData.data) {
		return {
			title: "Blog Not Found | Digital World",
			description: "The blog post you are looking for could not be found.",
		}
	}

	const { title, description, image, relatedBlogCategory } = blogData.data

	return {
		title: `${title} | Digital World Blog`,
		description:
			description ||
			`Read "${title}" on Digital World — insights, reviews, and technology news.`,
		keywords: [
			title,
			relatedBlogCategory?.title || "",
			"Digital World blog",
			"tech news",
			"reviews",
			"e-commerce",
		],
		openGraph: {
			title: `${title} | Digital World Blog`,
			description:
				description ||
				`Read "${title}" on Digital World — insights, reviews, and technology news.`,
			images: [
				{
					url: image,
					width: 1200,
					height: 630,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | Digital World Blog`,
			description:
				description ||
				`Read "${title}" on Digital World — insights, reviews, and technology news.`,
			images: [image],
		},
	}
}

export default async function Blog(props: Props) {
	const singleBlogSlug = props.params.blogSlug
	const cookieStore = cookies()
	const accessToken = cookieStore.get("accessToken")?.value
	const refreshToken = cookieStore.get("refreshToken")?.value
	const cookieHeader = [
		accessToken ? `accessToken=${accessToken}` : "",
		refreshToken ? `refreshToken=${refreshToken}` : "",
	]
		.filter(Boolean) // remove empty strings
		.join("; ")

	const blogPost = await fetch(API + `/blog/get-blog/${singleBlogSlug}`, {
		method: "GET",
		credentials: "include",
		headers: {
			Cookie: cookieHeader,
		},
		cache: "no-cache",
	})

	const blogPostData = await blogPost.json()

	const getBlogsByCategory = async (categorySlug: string, limit = 5) => {
		const res = await fetch(
			API + `/blog/blog-category/${categorySlug}?limit=${limit}`,
			{
				method: "GET",
				credentials: "include",
				cache: "no-cache",
			}
		)
		return res.json()
	}

	const ecommercialBlogs = await getBlogsByCategory("e-commercial")
	const reviewBlogs = await getBlogsByCategory("review")
	const technologyBlogs = await getBlogsByCategory("technology")

	const relatedBlogsFromSameCategory = await getBlogsByCategory(
		blogPostData.data.relatedBlogCategory.slug,
		6
	)

	return (
		<main className="w-main">
			<nav className="text-sm my-2 text-gray-600">
				<Link href="/blog" className="hover:underline text-blue-600">
					Blog
				</Link>
				{blogPostData?.data?.relatedBlogCategory?.slug && (
					<>
						<span className="mx-2">/</span>
						<Link
							href={`/blog?category=${blogPostData.data.relatedBlogCategory.slug}#newest-blogs`}
							className="hover:underline text-blue-600"
						>
							{blogPostData.data.relatedBlogCategory.title}
						</Link>
					</>
				)}
			</nav>
			<div className="bg-white shadow rounded-lg hover:shadow-xl transition-shadow duration-300 grid grid-cols-12 gap-1 p-1">
				<SingleBlog blogPostData={blogPostData} />
				<div className="col-span-12 lg:col-span-4 space-y-6">
					<section className="">
						<h2 className="font-bebasNeue text-2xl font-bold mb-4 text-right uppercase p-2 bg-[#03304b] rounded relative">
							<span className="text-white mx-4">E-commercial Blogs</span>
							<FaBoltLightning
								size={42}
								className="text-yellow-500 absolute top-[-16px] right-[-14px] rounded-full p-2 bg-black"
							/>
						</h2>
						<BlogCategory blogCategoryData={ecommercialBlogs} />
					</section>
					<section className="">
						<h2 className="font-bebasNeue text-2xl font-bold mb-4 text-right uppercase p-2 bg-[#771f5d] rounded relative">
							<span className="text-white mx-4">Review Blogs</span>
							<FaReadme
								size={42}
								className="text-yellow-500 absolute top-[-16px] right-[-14px] rounded-full p-2 bg-black"
							/>
						</h2>
						<BlogCategory blogCategoryData={reviewBlogs} />
					</section>
					<section className="">
						<h2 className="font-bebasNeue text-2xl font-bold mb-4 text-right uppercase p-2 bg-[#83361e] rounded relative">
							<span className="text-white mx-4">Technology Blogs</span>
							<GrTechnology
								size={42}
								className="text-yellow-500 absolute top-[-16px] right-[-14px] rounded-full p-2 bg-black"
							/>
						</h2>
						<BlogCategory blogCategoryData={technologyBlogs} />
					</section>
				</div>
			</div>
			{blogPostData.data.relatedProducts.length > 0 && (
				<div className="mt-8 p-4 bg-gray-50 rounded-lg shadow">
					<h2 className="text-3xl font-bold mb-4 font-bebasNeue">
						Related Products
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{blogPostData.data.relatedProducts.map((product: any) => (
							<div
								key={product._id}
								className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
							>
								<CustomImage
									src={product.thumbnail}
									alt={product.title}
									className="h-[160px] w-[160px] object-contain rounded mb-2"
									fill
								/>
								<h3 className="text-lg font-semibold mb-1">{product.title}</h3>
								<Link
									href={`/product/${product.slug}`}
									className="text-blue-600 hover:underline"
								>
									View Product
								</Link>
							</div>
						))}
					</div>
				</div>
			)}
			{relatedBlogsFromSameCategory.data.length > 0 && (
				<section className="mt-8 mb-4">
					<h2 className="text-3xl font-bold mb-4 font-bebasNeue">
						Related Blogs
					</h2>
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
						{relatedBlogsFromSameCategory.data.map((blog: BlogCategoryData) => (
							<div
								key={blog._id}
								className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition-shadow duration-300"
							>
								<Link
									href={`/blog/${blog.slug}`}
									className="block hover:opacity-90"
								>
									<CustomImage
										src={blog.image}
										alt={blog.title}
										className="h-[160px] w-full object-cover rounded mb-2"
										fill
									/>
									<h3 className="text-lg font-semibold mb-1 line-clamp-2">
										{blog.title}
									</h3>
								</Link>
								<p className="text-gray-700 text-sm line-clamp-3">
									<InnerHTML html={blog.description} />
								</p>
							</div>
						))}
					</div>
				</section>
			)}
		</main>
	)
}
