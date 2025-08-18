import dynamic from "next/dynamic"
import { Suspense } from "react"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export const metadata = {
	title: "Manage Users | Digital World Admin",
	description: "View, edit, and manage registered users of Digital World.",
	robots: { index: false, follow: false },
}

const ManageUserList = dynamic(() => import("@/components/ManageUserList"), {
	ssr: false,
})

export default async function AdminManageUser(props: Props) {
	return (
		<main className="w-full">
			<h1 className="text-center text-3xl font-bold font-bebasNeue mt-8">
				Manage users
			</h1>
			<Suspense fallback={<div>Loading...</div>}>
				<ManageUserList />
			</Suspense>
		</main>
	)
}
