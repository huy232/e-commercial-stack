import dynamic from "next/dynamic"

export const metadata = {
	title: "Manage Blog Categories | Digital World Admin",
	description:
		"Organize, edit, and create blog categories for the Digital World website.",
	robots: { index: false, follow: false },
}

const ManageBlogCategories = dynamic(
	() => import("@/components/ManageBlogCategories"),
	{
		ssr: false,
	}
)

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
