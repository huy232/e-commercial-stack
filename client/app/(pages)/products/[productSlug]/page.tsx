import { API, WEB_URL } from "@/constant"
import { ProductDetail } from "@/components"
import type { Metadata } from "next"

// Dynamic Metadata
export async function generateMetadata({
	params,
}: {
	params: { productSlug: string }
}): Promise<Metadata> {
	const { productSlug } = params

	// Fetch product data
	const productResponse = await fetch(
		`${API}/product/get-product/${productSlug}`,
		{ method: "GET", cache: "no-cache" }
	)
	const product = await productResponse.json()

	if (!product.success || !product.data) {
		return {
			title: "Product Not Found | Digital World",
			description: "This product could not be found.",
		}
	}

	const { title, description, thumbnail } = product.data

	return {
		title: `${title} | Digital World`,
		description:
			description ||
			`Buy ${title} at Digital World. Premium quality, best price.`,
		keywords: [
			title,
			"buy online",
			"digital world",
			"electronics",
			product.data.category?.name || "",
		],
		openGraph: {
			title: `${title} | Digital World`,
			description:
				description ||
				`Buy ${title} at Digital World. Premium quality, best price.`,
			images: [
				{
					url: thumbnail,
					width: 800,
					height: 600,
					alt: title,
				},
			],
		},
		twitter: {
			card: "summary_large_image",
			title: `${title} | Digital World`,
			description: description || `Buy ${title} at Digital World.`,
			images: [thumbnail],
		},
	}
}

// Page Component
export default async function Product({
	params,
}: {
	params: { productSlug: string }
}) {
	const { productSlug } = params

	const productResponse = await fetch(
		WEB_URL + `/api/product/get-product/${productSlug}`,
		{ method: "GET", cache: "no-cache" }
	)
	const product = await productResponse.json()
	const { success, data } = product

	if (!success) {
		return <main>There is no data for this product</main>
	}

	const { category } = data

	const relatedProductsResponse = await fetch(
		WEB_URL +
			`/api/product/get-all-product?` +
			new URLSearchParams({
				category: category.slug || "",
				limit: "10",
			}),
		{ method: "GET", cache: "no-cache" }
	)
	const relatedProducts = await relatedProductsResponse.json()

	return (
		<main className="w-full xl:w-main">
			<ProductDetail product={data} relatedProducts={relatedProducts.data} />
		</main>
	)
}
