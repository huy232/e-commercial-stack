import { ManageOrdersList } from "@/components"
import { Suspense } from "react"

export default async function AdminManageOrders() {
	return (
		<div>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Manage orders
			</h1>
			<Suspense fallback={<div>Loading...</div>}>
				<ManageOrdersList />
			</Suspense>
		</div>
	)
}
