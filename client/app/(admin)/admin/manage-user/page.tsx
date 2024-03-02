import { getUsers } from "@/app/api"
import { ManageUserList } from "@/components"
import { redirect } from "next/navigation"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminManageUser(props: Props) {
	const searchParams = props.searchParams
	return (
		<main>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Manage users
			</h1>
			<ManageUserList searchParams={searchParams} />
		</main>
	)
}
