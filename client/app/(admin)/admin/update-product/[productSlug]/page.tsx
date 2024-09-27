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
	const productResponse = await fetch(URL + `/api/product/` + productSlug, {
		method: "GET",
	})
	const categoryResponse = await fetch(URL + "/api/category", { method: "GET" })

	const product = await productResponse.json()
	const categories = await categoryResponse.json()
	const { success, data } = categories
	let categoriesData = []
	if (success) {
		categoriesData = data
	}
	return (
		<main>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Update product
			</h1>
			<UpdateProduct productResponse={product} categories={categoriesData} />
		</main>
	)
}
