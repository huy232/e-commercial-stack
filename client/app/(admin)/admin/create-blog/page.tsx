import { API } from "@/constant"
import BlogFormWrapper from "@/components/Forms/BlogFormWrapper" // new wrapper

export const metadata = {
	title: "Create Blog | Digital World Admin",
	description:
		"Write and publish new blog posts for the Digital World website.",
	robots: { index: false, follow: false },
}

export default async function AdminCreateBlog({
	searchParams,
}: {
	searchParams: { [key: string]: string | string[] | undefined }
}) {
	const normalizedParams = Object.entries(searchParams).reduce(
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

	const productRes = await fetch(
		API + `/product/get-all-product?${queryString}`,
		{ cache: "no-cache" }
	)
	if (!productRes.ok) {
		throw new Error("Failed to fetch products")
	}
	const products = await productRes.json()
	const productCategoriesRes = await fetch(API + `/product-category`, {
		cache: "no-cache",
	})
	if (!productCategoriesRes.ok) {
		throw new Error("Failed to fetch categories")
	}
	const productCategories = await productCategoriesRes.json()

	const blogCategoryRes = await fetch(API + `/blog-category`, {
		cache: "no-cache",
	})
	if (!blogCategoryRes.ok) {
		throw new Error("Failed to fetch blog categories")
	}
	const blogCategories = await blogCategoryRes.json()

	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Create blog
			</h1>

			<BlogFormWrapper
				mode="create"
				products={products}
				categories={productCategories}
				blogCategories={blogCategories.data}
			/>
		</main>
	)
}
