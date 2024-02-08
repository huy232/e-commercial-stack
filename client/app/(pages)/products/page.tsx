import { getProducts } from "@/app/api"
import { Breadcrumb, ProductList } from "@/components"

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
			const response = await getProducts(params)
			return response.data
		} catch (error) {
			console.error("Error fetching products:", error)
			return []
		}
	}

	return (
		<main className="w-full">
			<div className="w-main justify-center items-center mx-auto">
				<h2 className="uppercase font-semibold">{category}</h2>
				<Breadcrumb breadcrumbs={breadcrumbs} allowTitle={false} />
			</div>
			<ProductList fetchProducts={fetchProducts} />
		</main>
	)
}
