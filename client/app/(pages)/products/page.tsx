import { Breadcrumb, ProductList } from "@/components"
import { URL } from "@/constant"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default function Products(props: Props) {
	const searchParams = props.searchParams
	const { category } = searchParams
	let breadcrumbs = [{ name: "Home", slug: "/" }]
	if (category) {
		breadcrumbs.push({
			name: category as string,
			slug: `product?category=${category}`,
		})
	}

	const fetchProducts = async (params: {}) => {
		"use server"
		try {
			const response = await fetch(
				URL + "/api/product/all-product?" + new URLSearchParams(params),
				{ method: "GET" }
			)
			const data = await response.json()
			return data
		} catch (error) {
			console.error("Error fetching products:", error)
			return {
				success: false,
				data: [],
				counts: 0,
				totalPages: 0,
				currentPage: 0,
			}
		}
	}

	return (
		<main className="w-full">
			<div className="w-main justify-center items-center mx-auto">
				<h2 className="uppercase font-semibold">{category}</h2>
				<Breadcrumb breadcrumbs={breadcrumbs} allowTitle={false} />
			</div>
			<ProductList fetchProducts={fetchProducts} searchParams={searchParams} />
		</main>
	)
}
