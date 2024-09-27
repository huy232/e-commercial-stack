"use client"
import { formatPrice, renderStarFromNumber } from "@/utils"
import {
	Breadcrumb,
	CustomSlider,
	ProductCart,
	ProductExtraInfo,
	ProductInformation,
	ProductSlider,
} from "@/components"
import { FC, useState } from "react"
import { ProductType, VariantType } from "@/types/product"
import { productExtraInformation } from "@/constant"
import { handleUserCart } from "@/store/actions/"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/types"
import { URL } from "../../constant/url"

interface ProductDetailProps {
	product: ProductType
	relatedProducts: ProductType[]
}

const ProductDetail: FC<ProductDetailProps> = ({
	product,
	relatedProducts,
}) => {
	console.log(product)
	const dispatch = useDispatch<AppDispatch>()
	const [quantity, setQuantity] = useState<number>(1)

	let breadcrumbs = [{ name: "Home", slug: "/" }]
	if (product.category) {
		breadcrumbs.push({
			name: product.category[1],
			slug: `/products?category=${product.category[1]}`,
		})
	}
	const updateReviews = async () => {
		const productResponse = await fetch(URL + "/api/product/" + product.slug, {
			method: "GET",
		})
		const { data } = await productResponse.json()
		return data
	}

	const handleProductDetail = async (variant: VariantType | null) => {
		await dispatch(
			handleUserCart({
				product_id: product._id,
				variant_id: variant ? variant._id : null,
				quantity,
			})
		)
	}
	return (
		<>
			<section className="w-main flex flex-col bg-gray-100">
				<h2 className="text-xl font-semibold">{product.title}</h2>
				<Breadcrumb
					breadcrumbs={breadcrumbs}
					productTitle={product.title}
					allowTitle={true}
				/>
			</section>
			<section className="mx-auto flex">
				<div className="w-2/5 flex flex-col gap-4">
					<ProductSlider images={product.images} />
				</div>
				<div className="w-2/5 flex flex-col">
					<div className="flex flex-col">
						<span className="font-bold text-xl">
							{formatPrice(product.price)}
						</span>
						<span>Available: {product.quantity}</span>
						<span>Sold: 100</span>
						<span className="flex">
							{renderStarFromNumber(product.totalRatings)}
						</span>
						<ul className="text-sm text-gray-500 px-6">
							{product.description.split(",").map((element: string) => (
								<li
									className="list-item list-square leading-6"
									key={element}
									dangerouslySetInnerHTML={{ __html: element }}
								/>
							))}
						</ul>
					</div>
					<div className="flex flex-col gap-8">
						<ProductCart
							variants={product.variants}
							handleProductDetail={handleProductDetail}
							product={product}
							onQuantityChange={setQuantity}
						/>
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
				<ProductInformation product={product} updateReviews={updateReviews} />
			</div>
			{relatedProducts && (
				<div>
					<h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
						Other customer also liked
					</h3>
					<CustomSlider products={relatedProducts} supportHover supportDetail />
				</div>
			)}
		</>
	)
}
export default ProductDetail
