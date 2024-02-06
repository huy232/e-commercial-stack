import { Breadcrumb } from "@/components"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default function Products(props: Props) {
	const searchParams = props.searchParams
	const { category } = searchParams
	const breadcrumb = ["Home", category as string]
	return (
		<main className="w-full">
			<div className="w-main justify-center items-center mx-auto">
				<h2 className="uppercase font-semibold">{category}</h2>
				<Breadcrumb categories={breadcrumb} allowTitle={false} />
			</div>

			<div className="w-main border p-4 flex justify-center items-center mx-auto">
				<div className="w-4/5 flex-auto">Filter</div>
				<div className="w-1/5">Sort by</div>
			</div>
		</main>
	)
}
