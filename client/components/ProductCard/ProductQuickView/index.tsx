"use client"

import {
	Button,
	CustomImage,
	ProductCart,
	ProductQuantity,
	ProductSlider,
} from "@/components"
import { ProductType, VariantType } from "@/types"
import { formatPrice, renderStarFromNumber } from "@/utils"
import { FC, useState } from "react"

interface ProductQuickViewProps {
	product: ProductType
}
const ProductQuickView: FC<ProductQuickViewProps> = ({ product }) => {
	const [productDetail, setProductDetail] = useState<ProductType>(product)
	const [selectedVariantImages, setSelectedVariantImages] = useState<string[]>(
		product.images
	)
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
			<div className="w-[320px] h-[50vh] lg:w-[40vw] flex flex-row">
				<div
					className="
						w-3/5"
				>
					<ProductSlider images={selectedVariantImages} />
				</div>
				<div className="w-2/5">
					<h2 className="line-clamp-2 text-xl font-bold">{product.title}</h2>
					<span>{formatPrice(product.price)}</span>
					<span>Available: {productDetail.quantity}</span>
					<span>Sold: 100</span>
					<span className="flex">
						{renderStarFromNumber(productDetail.totalRatings)}
					</span>
					<span
						className="line-clamp-5 text-xs"
						dangerouslySetInnerHTML={{ __html: product.description }}
					/>
					<div className="flex flex-col gap-8">
						<ProductCart
							variants={productDetail.variants}
							handleProductDetail={handleProductDetail}
						/>
					</div>
				</div>
			</div>
		</>
	)
}
export default ProductQuickView
