import { UpdateProduct } from "@/components"
import { URL } from "@/constant"

type Props = {
	params: {
		productSlug: string
	}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminUpdateProduct(props: Props) {
	const { productSlug } = props.params

	console.log("Product slug: ", productSlug)

	const productResponse = await fetch(URL + `/api/product/` + productSlug, {
		method: "GET",
		cache: "no-cache",
	})
	const categoryResponse = await fetch(URL + "/api/category", {
		method: "GET",
		cache: "no-cache",
	})

	const product = await productResponse.json()
	const categories = await categoryResponse.json()
	const { success, data } = categories
	let categoriesData = []
	if (success) {
		categoriesData = data
	}

	console.log(product)

	return (
		<main>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Update product
			</h1>
			<UpdateProduct productResponse={product} categories={categoriesData} />
		</main>
	)
}
