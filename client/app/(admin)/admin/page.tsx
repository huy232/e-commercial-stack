import { Metadata } from "next"
import dynamic from "next/dynamic"

export const metadata: Metadata = {
	title: "Dashboard | Digital World Admin",
	description: "Manage your store, products, orders, and customers.",
	robots: {
		index: false,
		follow: false, // Prevent search engines from indexing
	},
}
const AdminDashboard = dynamic(() => import("@/components/AdminDashboard"), {
	ssr: false,
})

export default function AdminDashboardPage() {
	return <AdminDashboard />
}
