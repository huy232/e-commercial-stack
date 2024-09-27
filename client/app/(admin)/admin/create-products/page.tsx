import { CreateProduct } from "@/components"
import { API, URL } from "@/constant"

export default async function AdminCreateProducts() {
	const categoryResponse = (
		await fetch(API + "/product-category", { method: "GET", cache: "no-cache" })
	).json()
	const { data } = await categoryResponse
	return (
		<div>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Create products
			</h1>
			<CreateProduct categories={data} />
		</div>
	)
}
