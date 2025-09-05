export const dynamic = "force-dynamic"

import { WEB_URL } from "@/constant"
import dynamicImport from "next/dynamic"

export const metadata = {
	title: "Create Product | Digital World Admin",
	description:
		"Add new products to the Digital World store with images, prices, and details.",
	robots: { index: false, follow: false },
}

const CreateProduct = dynamicImport(
	() => import("@/components/CreateProduct"),
	{
		ssr: false,
	}
)

export default async function AdminCreateProducts() {
	const categoryResponse = await fetch(WEB_URL + "/api/product-category", {
		method: "GET",
		cache: "no-cache",
		credentials: "include",
	})
	const { data } = await categoryResponse.json()

	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Create products
			</h1>
			<CreateProduct categories={data} />
		</main>
	)
}
