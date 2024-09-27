import { ManageBrand } from "@/components"
import { API, URL } from "@/constant"

export default async function AdminManageBrands() {
	const categoryResponse = await fetch(API + "/product-category", {
		method: "GET",
	})
	const { data } = await categoryResponse.json()
	return (
		<div>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Manage brand
			</h1>
			<ManageBrand categories={data} />
		</div>
	)
}
