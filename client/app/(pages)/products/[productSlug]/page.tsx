import { getSpecificProduct } from "@/app/api"
import {
	Breadcrumb,
	CustomImage,
	CustomSlider,
	ProductSlider,
} from "@/components"
import Image from "next/image"

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
			<section className="w-main flex flex-col bg-gray-100">
				<h2 className="text-xl font-semibold">{data.title}</h2>
				<Breadcrumb categories={category} productTitle={title} />
			</section>
			<section className="mx-auto flex">
				<div className="w-2/5 flex flex-col gap-4">
					<CustomImage src={images[0]} alt="Product" className="w-full" />
					<ProductSlider images={images} />
				</div>
				<div className="w-2/5">Content</div>
				<div className="w-1/5">Content</div>
			</section>
		</main>
	)
}
