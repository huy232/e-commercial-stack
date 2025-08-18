import { AdminDashboard } from "@/components"
import { Metadata } from "next"

export const metadata: Metadata = {
	title: "Dashboard | Digital World Admin",
	description: "Manage your store, products, orders, and customers.",
	robots: {
		index: false,
		follow: false, // Prevent search engines from indexing
	},
}

export default function AdminDashboardPage() {
	return <AdminDashboard />
}
