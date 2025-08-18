import dynamic from "next/dynamic"
import { Suspense } from "react"

export const metadata = {
	title: "Manage Orders | Digital World Admin",
	description: "Track, update, and fulfill customer orders efficiently.",
	robots: { index: false, follow: false },
}

const ManageOrdersList = dynamic(
	() => import("@/components/ManageOrdersList"),
	{
		ssr: false,
	}
)

export default async function AdminManageOrders() {
	return (
		<div className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Manage orders
			</h1>
			<Suspense fallback={<div>Loading...</div>}>
				<ManageOrdersList />
			</Suspense>
		</div>
	)
}
