import { WEB_URL } from "@/constant"
import BlogFormWrapper from "@/components/Forms/BlogFormWrapper"
import { notFound } from "next/navigation"

type Props = {
	params: {
		blogSlug: string
	}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata = {
	title: "Update Blog | Digital World Admin",
	description:
		"Edit and update blog posts with new content, categories, and related products in the Digital World admin panel.",
	robots: { index: false, follow: false },
}

export default async function AdminUpdateBlog(props: Props) {
	const { blogSlug } = props.params
	if (!blogSlug) {
		throw new Error("Blog slug is required")
	}

	const normalizedParams = Object.entries(props.searchParams).reduce(
		(acc: Record<string, string>, [key, value]) => {
			if (typeof value === "string") {
				acc[key] = value
			} else if (Array.isArray(value)) {
				acc[key] = value.join(",")
			}
			return acc
		},
		{}
	)

	const queryString = new URLSearchParams(normalizedParams).toString()

	const [productsRes, categoriesRes, blogRes, blogCategoriesRes] =
		await Promise.all([
			fetch(WEB_URL + `/api/product/get-all-product?${queryString}`, {
				cache: "no-cache",
				method: "GET",
				credentials: "include",
			}),
			fetch(WEB_URL + `/api/product-category`, {
				cache: "no-cache",
				method: "GET",
				credentials: "include",
			}),
			fetch(WEB_URL + `/api/blog/one-blog-by-slug/${blogSlug}`, {
				cache: "no-cache",
				method: "GET",
				credentials: "include",
			}),
			fetch(WEB_URL + `/api/blog-category`, {
				cache: "no-cache",
				method: "GET",
				credentials: "include",
			}),
		])

	const [products, categories, blogData, blogCategories] = await Promise.all([
		productsRes.json(),
		categoriesRes.json(),
		blogRes.json(),
		blogCategoriesRes.json(),
	])

	if (!blogData.success || !blogData.data) {
		return notFound() // Show 404 if blog not found
	}

	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Update blog
			</h1>

			<BlogFormWrapper
				mode="update"
				products={products}
				categories={categories}
				blogId={blogData.data._id}
				defaultValues={blogData.data}
				blogCategories={blogCategories.data || []}
			/>
		</main>
	)
}
