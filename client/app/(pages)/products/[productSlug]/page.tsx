import { ProductDetail } from "@/components"
import { URL } from "../../../../constant/url"

export default async function Product({
	params,
}: {
	params: { productSlug: string }
}) {
	const { productSlug } = params
	const productResponse = await fetch(URL + "/api/product/" + productSlug)
	const product = await productResponse.json()
	const { success, data } = product
	if (!success) {
		return <main>There is no data for this product</main>
	}
	const { category } = data
	const relatedProductsResponse = await fetch(
		URL +
			"/api/product?" +
			new URLSearchParams({
				category: category[1] || "",
				limit: "5",
			}),
		{ method: "GET" }
	)
	const relatedProducts = await relatedProductsResponse.json()
	return (
		<main className="w-full">
			<ProductDetail product={data} relatedProducts={relatedProducts.data} />
		</main>
	)
}
