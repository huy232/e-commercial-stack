import { ManageProducts } from "@/components"
import { Suspense } from "react"

export const metadata = {
	title: "Manage Products | Digital World Admin",
	description: "Edit, update, and manage the products available in your store.",
	robots: { index: false, follow: false },
}

export default async function AdminManageProducts() {
	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Manage products
			</h1>
			<Suspense fallback={<div>Loading...</div>}>
				<ManageProducts />
			</Suspense>
		</main>
	)
}
