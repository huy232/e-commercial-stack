import { Breadcrumb, ProductList } from "@/components"
import { API, URL } from "@/constant"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

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
	// const fetchProducts = async (params: {}) => {
	// 	"use server"
	// 	try {
	// 		const response = await fetch(
	// 			URL + "/api/product/all-product?" + new URLSearchParams(params),
	// 			{ method: "GET" }
	// 		)
	// 		const data = await response.json()
	// 		return data
	// 	} catch (error) {
	// 		console.error("Error fetching products:", error)
	// 		return {
	// 			success: false,
	// 			data: [],
	// 			counts: 0,
	// 			totalPages: 0,
	// 			currentPage: 0,
	// 		}
	// 	}
	// }
	return (
		<main className="w-full">
			<div className="w-main justify-center items-center mx-auto">
				<h2 className="uppercase font-semibold">{category}</h2>
				<Breadcrumb breadcrumbs={breadcrumbs} allowTitle={false} />
			</div>
			<ProductList
				// fetchProducts={fetchProducts}
				searchParams={searchParams}
				products={products.data}
				categories={categories.data}
			/>
		</main>
	)
}
