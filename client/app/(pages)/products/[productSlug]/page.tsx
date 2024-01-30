import { getSpecificProduct } from "@/app/api"
import {
	Breadcrumb,
	Button,
	CustomImage,
	CustomSlider,
	ProductSlider,
} from "@/components"
import Image from "next/image"
import { formatPrice } from "../../../../utils/formatPrice"
import { renderStarFromNumber } from "../../../../utils/renderStarFromNumber"

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
		description,
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
					{/* <CustomImage src={images[0]} alt="Product" className="w-full" /> */}
					<ProductSlider images={images} />
				</div>
				<div className="w-2/5 flex flex-col">
					<div className="flex flex-col">
						<span className="font-bold text-xl">{formatPrice(price)}</span>
						<span>Available: {quantity}</span>
						<span>Sold: 100</span>
						<span className="flex">{renderStarFromNumber(totalRatings)}</span>
						<ul className="list-item list-square text-sm text-gray-500 px-6">
							{description.split(",").map((element: string) => (
								<li className="leading-6" key={element}>
									{element}
								</li>
							))}
						</ul>
					</div>
					<div>
						<Button className="w-full bg-rose-500 text-white hover:opacity-80 hover-effect p-2 rounded">
							Add to cart
						</Button>
					</div>
				</div>
				<div className="w-1/5">Content</div>
			</section>
		</main>
	)
}
