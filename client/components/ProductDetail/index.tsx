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
import { getSpecificProduct } from "@/app/api"

interface ProductDetailProps {
	product: ProductType
	relatedProducts: ProductType[]
}

const ProductDetail: FC<ProductDetailProps> = ({
	product,
	relatedProducts,
}) => {
	const [productDetail, setProductDetail] = useState<ProductType>(product)
	const [selectedVariantImages, setSelectedVariantImages] = useState<string[]>(
		product.images
	)
	let breadcrumbs = [{ name: "Home", slug: "/" }]
	if (productDetail.category) {
		breadcrumbs.push({
			name: productDetail.category[1],
			slug: `product?category=${productDetail.category[1]}`,
		})
	}
	const updateReviews = async () => {
		const product = await getSpecificProduct(productDetail.slug)
		const { data } = product
		return data
	}
	const handleProductDetail = async (variant: VariantType | null) => {
		if (variant) {
			setProductDetail({
				...productDetail,
				title: variant.title,
				price: variant.price,
				thumbnail: variant.thumbnail,
				images: variant.images,
			})
			setSelectedVariantImages(variant.images)
		} else {
			setProductDetail(product)
			setSelectedVariantImages(product.images)
		}
	}

	return (
		<>
			<section className="w-main flex flex-col bg-gray-100">
				<h2 className="text-xl font-semibold">{productDetail.title}</h2>
				<Breadcrumb
					breadcrumbs={breadcrumbs}
					productTitle={productDetail.title}
					allowTitle={true}
				/>
			</section>
			<section className="mx-auto flex">
				<div className="w-2/5 flex flex-col gap-4">
					<ProductSlider images={selectedVariantImages} />
				</div>
				<div className="w-2/5 flex flex-col">
					<div className="flex flex-col">
						<span className="font-bold text-xl">
							{formatPrice(productDetail.price)}
						</span>
						<span>Available: {productDetail.quantity}</span>
						<span>Sold: 100</span>
						<span className="flex">
							{renderStarFromNumber(productDetail.totalRatings)}
						</span>
						<ul className="text-sm text-gray-500 px-6">
							{productDetail.description.split(",").map((element: string) => (
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
							variants={productDetail.variants}
							handleProductDetail={handleProductDetail}
							product={productDetail}
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
				<ProductInformation
					product={productDetail}
					updateReviews={updateReviews}
				/>
			</div>
			{relatedProducts && (
				<div>
					<h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main">
						Other customer also liked
					</h3>
					<CustomSlider products={relatedProducts} />
				</div>
			)}
		</>
	)
}
export default ProductDetail
