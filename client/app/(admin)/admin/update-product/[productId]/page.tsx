import { ManageUserList } from "@/components"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default async function AdminUpdateProduct(props: Props) {
	console.log(props.params)
	console.log(props.searchParams)
	return (
		<main>
			<h1 className="h-[75px] flex justify-between items-center text-3xl font-bold px-4">
				Update product
			</h1>
		</main>
	)
}
