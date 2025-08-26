import { API } from "@/constant"
import { FaBoltLightning, FaReadme, GrTechnology } from "@/assets/icons"
import { Metadata } from "next"
import dynamic from "next/dynamic"

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

const NewsBlog = dynamic(() => import("@/components/BlogComponent/NewsBlog"), {
	ssr: false,
})

const MostViewedBlog = dynamic(
	() => import("@/components/BlogComponent/MostViewedBlog"),
	{
		ssr: false,
	}
)

const BlogCategory = dynamic(
	() => import("@/components/BlogComponent/BlogCategory"),
	{
		ssr: false,
	}
)

const BlogCategoryFilter = dynamic(
	() => import("@/components/BlogComponent/BlogCategoryFilter"),
	{
		ssr: false,
	}
)

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
		<main className="w-full xl:w-main">
			<h1 className="font-bebasNeue text-right mx-4 text-3xl font-black">
				News / blog
			</h1>

			<div className="grid grid-cols-12 gap-1 p-1 mt-4">
				<div className="col-span-12 xl:col-span-8">
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

				<div className="col-span-12 xl:col-span-4 gap-6 md:grid md:grid-cols-2 xl:block">
					<section className="mb-6">
						<h2 className="font-bebasNeue text-2xl font-bold mb-4 text-center md:text-right uppercase p-2 bg-[#03304b] rounded relative">
							<span className="text-white mx-4">E-commercial Blogs</span>
							<FaBoltLightning
								size={42}
								className="text-yellow-500 absolute top-[-12px] right-[-8px] md:top-[-16px] md:right-[-14px] rounded-full p-2 bg-black"
							/>
						</h2>
						<BlogCategory blogCategoryData={ecommercialBlogs} />
					</section>
					<section className="mb-6">
						<h2 className="font-bebasNeue text-2xl font-bold mb-4 text-center md:text-right uppercase p-2 bg-[#771f5d] rounded relative">
							<span className="text-white mx-4">Review Blogs</span>
							<FaReadme
								size={42}
								className="text-yellow-500 absolute top-[-12px] right-[-8px] md:top-[-16px] md:right-[-14px] rounded-full p-2 bg-black"
							/>
						</h2>
						<BlogCategory blogCategoryData={reviewBlogs} />
					</section>
					<section className="mb-6">
						<h2 className="font-bebasNeue text-2xl font-bold mb-4 text-center md:text-right uppercase p-2 bg-[#83361e] rounded relative">
							<span className="text-white mx-4">Technology Blogs</span>
							<GrTechnology
								size={42}
								className="text-yellow-500 absolute top-[-12px] right-[-8px] md:top-[-16px] md:right-[-14px] rounded-full p-2 bg-black"
							/>
						</h2>
						<BlogCategory blogCategoryData={technologyBlogs} />
					</section>
				</div>
			</div>
		</main>
	)
}
