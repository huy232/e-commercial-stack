import { ManageBrand } from "@/components"
import { API } from "@/constant"

export const metadata = {
	title: "Manage Brand | Digital World Admin",
	description:
		"Add, edit, and manage product brands available in the Digital World store.",
	robots: { index: false, follow: false },
}

export default async function AdminManageBrands() {
	const categoryResponse = await fetch(API + "/product-category", {
		method: "GET",
	})
	const { data } = await categoryResponse.json()
	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Manage brand
			</h1>
			<ManageBrand categories={data} />
		</main>
	)
}
