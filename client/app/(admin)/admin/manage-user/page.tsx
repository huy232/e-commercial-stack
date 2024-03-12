import { ManageUserList } from "@/components"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminManageUser(props: Props) {
	return (
		<main>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Manage users
			</h1>
			<ManageUserList />
		</main>
	)
}
