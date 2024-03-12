import { ManageProducts } from "@/components"
import { redirect } from "next/navigation"

export default async function AdminManageProducts() {
	return (
		<div>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Manage products
			</h1>
			<ManageProducts />
		</div>
	)
}
