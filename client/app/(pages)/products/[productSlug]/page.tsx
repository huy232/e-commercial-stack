import { getSpecificProduct } from "@/app/api"
import { Breadcrumb } from "@/app/components"

export default async function Product({
	params,
}: {
	params: { productSlug: string }
}) {
	const { productSlug } = params
	const product = await getSpecificProduct(productSlug)
	const { success, data } = product
	if (!success) {
		return <main>There is no data for this product</main>
	}
	const {
		brand,
		category,
		color,
		createdAt,
		descriptrion,
		images,
		price,
		quantity,
		rating,
		slug,
		sold,
		title,
		totalRatings,
		updatedAt,
		_id,
		thumbnail,
	} = data
	return (
		<main className="w-full">
			<section className="">
				<h2 className="text-xl font-semibold">{data.title}</h2>
				<Breadcrumb categories={category} productTitle={title} />
			</section>
		</main>
	)
}
