import { getProducts, getSpecificProduct } from "@/app/api"
import {
	Breadcrumb,
	ProductCart,
	ProductInformation,
	ProductSlider,
	ProductExtraInfo,
	CustomSlider,
} from "@/components"
import { formatPrice, renderStarFromNumber } from "@/utils"
import { productExtraInformation } from "@/constant"

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

	const { data: relatedProducts } = await getProducts({
		category: category[1] || "",
		limit: 5,
	})

	let breadcrumbs = [{ name: "Home", slug: "/" }]
	if (category) {
		breadcrumbs.push({
			name: category[1],
			slug: `product?category=${category[1]}`,
		})
	}

	return (
		<main className="w-full">
			<section className="w-main flex flex-col bg-gray-100">
				<h2 className="text-xl font-semibold">{data.title}</h2>
				<Breadcrumb
					breadcrumbs={breadcrumbs}
					productTitle={title}
					allowTitle={true}
				/>
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
					<div className="flex flex-col gap-8">
						<ProductCart />
					</div>
				</div>
				<div className="w-1/5">
					{productExtraInformation.map((extra) => (
						<ProductExtraInfo
							key={extra.id}
							title={extra.title}
							description={extra.description}
							icon={extra.icon}
						/>
					))}
				</div>
			</section>
			<div className="w-main m-auto mt-8">
				<ProductInformation
					ratingTotal={totalRatings}
					ratingCount={18}
					productName={title}
				/>
			</div>
			<div>
				<h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
					Other customer also liked
				</h3>
				<CustomSlider products={relatedProducts} />
			</div>
		</main>
	)
}
