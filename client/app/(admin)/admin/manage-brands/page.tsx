export const dynamic = "force-dynamic"

import { WEB_URL } from "@/constant"
import dynamicImport from "next/dynamic"

export const metadata = {
	title: "Manage Brand | Digital World Admin",
	description:
		"Add, edit, and manage product brands available in the Digital World store.",
	robots: { index: false, follow: false },
}

const ManageBrand = dynamicImport(() => import("@/components/ManageBrand"), {
	ssr: false,
})

export default async function AdminManageBrands() {
	const categoryResponse = await fetch(WEB_URL + "/api/product-category", {
		method: "GET",
		credentials: "include",
		cache: "no-cache",
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
