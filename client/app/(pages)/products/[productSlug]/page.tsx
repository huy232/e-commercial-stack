import { getProducts, getSpecificProduct } from "@/app/api"
import { ProductDetail } from "@/components"

export default async function Product({
	params,
}: {
	params: { productSlug: string }
}) {
	const { productSlug } = params
	const product = await getSpecificProduct(productSlug)
	const { success, data } = product
	if (!success) {
		return <main>There is no data for this product</main>
	}
	const { category } = data
	const { data: relatedProducts } = await getProducts({
		category: category[1] || "",
		limit: 5,
	})

	return (
		<main className="w-full">
			<ProductDetail product={data} relatedProducts={relatedProducts} />
		</main>
	)
}
