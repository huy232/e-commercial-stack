import Link from "next/link"

type Props = {
	params: {}
	searchParams: { [key: string]: string | string[] | undefined }
}

export default function Services(props: Props) {
	const searchParams = props.searchParams
	return (
		<section className="flex flex-col items-center justify-center h-full">
			<h2 className="text-center font-bold uppercase">Services</h2>
		</section>
	)
}
