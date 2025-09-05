import { ManageBlogs } from "@/components"

type Props = {
	params: { blogSlug: string }
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata = {
	title: "Manage Blogs | Digital World Admin",
	description:
		"Create, update, and delete blog posts for the Digital World platform.",
	robots: { index: false, follow: false },
}

export default function AdminManageBlogs({ searchParams }: Props) {
	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Manage blogs
			</h1>
			<ManageBlogs initialSearchParams={searchParams} />
		</main>
	)
}
