import { API } from "@/constant"
import { Metadata } from "next"
import dynamic from "next/dynamic"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata: Metadata = {
	title: "Products | Digital World",
	description:
		"Explore our wide range of cutting-edge electronics at Digital World. From smartphones and laptops to gaming gear and smart home devices, find the latest technology to suit your needs.",
	keywords: [
		"Digital World products",
		"electronics store",
		"buy gadgets online",
		"latest tech products",
		"smartphones",
		"laptops",
		"gaming accessories",
		"smart home devices",
	],
}

const ProductList = dynamic(() => import("@/components/ProductList"), {
	ssr: false,
})

export default async function Products(props: Props) {
	const searchParams = props.searchParams
	const { category } = searchParams
	let breadcrumbs = [{ name: "Home", slug: "/" }]
	if (category) {
		breadcrumbs.push({
			name: category as string,
			slug: `product?category=${category}`,
		})
	}
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

	// Construct the query string using URLSearchParams
	const queryString = new URLSearchParams(normalizedParams).toString()

	const productsResponse = await fetch(
		API + `/product/get-all-product?${queryString}`,
		{
			method: "GET",
			cache: "no-cache",
		}
	)

	const categoriesResponse = await fetch(API + `/product-category`, {
		method: "GET",
		cache: "no-cache",
	})
	const products = await productsResponse.json()
	const categories = await categoriesResponse.json()

	return (
		<main className="w-full">
			<div className="w-main justify-center items-center mx-auto">
				<h2 className="uppercase font-semibold">{category}</h2>
				{/* <Breadcrumb breadcrumbs={breadcrumbs} allowTitle={false} /> */}
			</div>
			<ProductList
				searchParams={searchParams}
				products={products.data}
				categories={categories.data}
				totalPages={products.totalPages}
			/>
		</main>
	)
}
