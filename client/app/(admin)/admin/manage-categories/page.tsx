export const dynamic = "force-dynamic"

import { WEB_URL } from "@/constant"
import dynamicImport from "next/dynamic"

export const metadata = {
	title: "Manage Product Categories | Digital World Admin",
	description:
		"Add, edit, and remove product categories to keep your store organized.",
	robots: { index: false, follow: false },
}

const ManageCategories = dynamicImport(
	() => import("@/components/ManageCategories"),
	{
		ssr: false,
	}
)

export default async function AdminManageCategories() {
	const brandResponse = await fetch(WEB_URL + `/api/brand`, {
		method: "GET",
		cache: "no-cache",
		credentials: "include",
	})
	const categoryResponse = await fetch(WEB_URL + `/api/product-category`, {
		method: "GET",
		cache: "no-cache",
		credentials: "include",
	})
	const { data: brandData } = await brandResponse.json()
	const { data: categoriesData } = await categoryResponse.json()
	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Manage categories
			</h1>
			<ManageCategories brands={brandData} categories={categoriesData} />
		</main>
	)
}
