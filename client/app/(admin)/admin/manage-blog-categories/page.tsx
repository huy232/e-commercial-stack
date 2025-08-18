import { ManageBlogCategories, ManageBlogs } from "@/components"

export const metadata = {
	title: "Manage Blog Categories | Digital World Admin",
	description:
		"Organize, edit, and create blog categories for the Digital World website.",
	robots: { index: false, follow: false },
}

export default async function AdminManageBlogCategories() {
	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Manage blog categories
			</h1>
			<ManageBlogCategories />
		</main>
	)
}
