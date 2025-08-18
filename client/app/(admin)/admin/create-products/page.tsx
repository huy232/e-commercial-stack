import { API } from "@/constant"
import dynamic from "next/dynamic"

export const metadata = {
	title: "Create Product | Digital World Admin",
	description:
		"Add new products to the Digital World store with images, prices, and details.",
	robots: { index: false, follow: false },
}

const CreateProduct = dynamic(() => import("@/components/CreateProduct"), {
	ssr: false,
})

export default async function AdminCreateProducts() {
	const categoryResponse = (
		await fetch(API + "/product-category", { method: "GET", cache: "no-cache" })
	).json()
	const { data } = await categoryResponse
	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Create products
			</h1>
			<CreateProduct categories={data} />
		</main>
	)
}
