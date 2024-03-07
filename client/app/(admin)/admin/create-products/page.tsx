import { getProductCategory } from "@/app/api"
import { CreateProduct } from "@/components"
import { redirect } from "next/navigation"

export default async function AdminCreateProducts() {
	const categoryResponse = await getProductCategory()
	const categories = categoryResponse.success ? categoryResponse.data : []
	return (
		<div>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Create products
			</h1>
			<CreateProduct categories={categories} />
		</div>
	)
}
