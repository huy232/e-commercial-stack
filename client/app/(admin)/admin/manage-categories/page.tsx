import { ManageCategories } from "@/components"
import { API } from "@/constant"

export default async function AdminManageCategories() {
	const brandResponse = await fetch(API + "/brand", {
		method: "GET",
		cache: "no-cache",
	})
	const categoryResponse = await fetch(API + "/product-category", {
		method: "GET",
		cache: "no-cache",
	})
	const { data: brandData } = await brandResponse.json()
	const { data: categoriesData } = await categoryResponse.json()
	return (
		<div>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Manage categories
			</h1>
			<ManageCategories brands={brandData} categories={categoriesData} />
		</div>
	)
}
