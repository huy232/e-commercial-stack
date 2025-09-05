import { UpdateProduct } from "@/components"
import { API, WEB_URL } from "@/constant"

type Props = {
	params: {
		productSlug: string
	}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata = {
	title: "Update Product | Digital World Admin",
	description:
		"Update product details, categories, pricing, and availability in the Digital World store.",
	robots: { index: false, follow: false },
}

export default async function AdminUpdateProduct(props: Props) {
	const { productSlug } = props.params
	const productResponse = await fetch(
		WEB_URL + `/api/product/get-product/${productSlug}`,
		{
			method: "GET",
			cache: "no-cache",
			credentials: "include",
		}
	)
	const categoryResponse = await fetch(WEB_URL + `/api/product-category`, {
		method: "GET",
		cache: "no-cache",
		credentials: "include",
	})

	const product = await productResponse.json()
	const categories = await categoryResponse.json()
	let content
	if (product.success && categories.success) {
		content = (
			<UpdateProduct productResponse={product} categories={categories.data} />
		)
	} else {
		content = <div>Something went wrong</div>
	}
	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Update product
			</h1>
			{content}
		</main>
	)
}
