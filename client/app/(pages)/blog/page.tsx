import { API } from "@/constant"
import NewsBlog from "./_components/NewsBlog"
import MostViewedBlog from "./_components/MostViewedBlog"
import BlogCategory from "./_components/BlogCategory"
import { FaBoltLightning, FaReadme, GrTechnology } from "@/assets/icons"
import { BlogCategoryFilter } from "./_components/BlogCategoryFilter"
import { Metadata } from "next"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
	title: "Blog | Digital World",
	description:
		"Read the latest articles, tips, and insights from Digital World. Stay updated on technology trends, product reviews, and expert advice to make the most of your digital lifestyle.",
	keywords: [
		"Digital World blog",
		"tech news",
		"technology tips",
		"product reviews",
		"electronics guide",
		"latest gadgets",
		"tech trends",
		"how-to guides",
	],
}

export default async function Blogs(props: Props) {
	const searchParams = props.searchParams
	const normalizedParams = Object.entries(searchParams).reduce(
		(acc: Record<string, string>, [key, value]) => {
			if (typeof value === "string") {
				acc[key] = value
			} else if (Array.isArray(value)) {
				acc[key] = value.join(",") // or handle arrays as needed
			}
			return acc
		},
		{}
	)
	const queryString = new URLSearchParams(normalizedParams).toString()

	const res = await fetch(API + `/blog?${queryString}`, {
		method: "GET",
		credentials: "include",
		cache: "no-cache",
	})
	const blogData = await res.json()

	const highestViewBlogs = await fetch(API + "/blog/highest-view", {
		method: "GET",
		credentials: "include",
		cache: "no-cache",
	})
	const highestViewBlogsData = await highestViewBlogs.json()

	const getBlogsByCategory = async (categorySlug: string, limit = 5) => {
		const res = await fetch(
			`${API}/blog/blog-category/${categorySlug}?limit=${limit}`,
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

	return (
		<main className="w-main">
			<h1 className="font-bebasNeue text-right mx-4 text-3xl font-black">
				News / blog
			</h1>

			{/* Main + Sidebar layout */}
			<div className="grid grid-cols-12 gap-1 p-1 mt-4">
				{/* Left: Main Blog Section (9 columns) */}
				<div className="col-span-12 lg:col-span-8">
					<section>
						<h2 className="font-bebasNeue text-2xl font-bold mb-2">
							Most Viewed Blogs
						</h2>
						<MostViewedBlog highestViewBlogsData={highestViewBlogsData} />
					</section>
					<section id="newest-blogs">
						<h2 className="font-bebasNeue text-2xl">Newest blogs</h2>
						<BlogCategoryFilter />
						<NewsBlog blogData={blogData} />
					</section>
				</div>

				{/* Right: Category Blog Sidebar (3 columns) */}
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
		</main>
	)
}
