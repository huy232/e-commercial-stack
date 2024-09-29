"use client"

import { ProductCart, ProductSlider } from "@/components"
import { handleUserCart } from "@/store/actions"
import {
	AppDispatch,
	ProductExtraType,
	ProductType,
	VariantType,
} from "@/types"
import { formatPrice, renderStarFromNumber } from "@/utils"
import { FC, useState } from "react"
import { useDispatch } from "react-redux"

interface ProductQuickViewProps {
	product: ProductExtraType
}
const ProductQuickView: FC<ProductQuickViewProps> = ({ product }) => {
	const dispatch = useDispatch<AppDispatch>()
	const [quantity, setQuantity] = useState<number>(1)
	const handleProductDetail = async (variant: VariantType | null) => {
		await dispatch(
			handleUserCart({
				product_id: product._id,
				variant_id: variant?._id || null,
				quantity,
			})
		)
	}

	return (
		<div className="w-[320px] h-[50vh] lg:w-[40vw] flex flex-row">
			<div
				className="
						w-3/5"
			>
				<ProductSlider images={product.images} />
			</div>
			<div className="w-2/5 flex flex-col">
				<h2 className="line-clamp-2 text-xl font-bold">{product.title}</h2>
				<span>{formatPrice(product.price)}</span>
				<span className="text-xs">Available: {product.quantity}</span>
				<span className="text-xs">Sold: 100</span>
				<span className="flex">
					{renderStarFromNumber(product.totalRatings)}
				</span>
				<span
					className="line-clamp-5 text-sm"
					dangerouslySetInnerHTML={{ __html: product.description }}
				/>
				<div className="flex flex-col gap-8">
					<ProductCart
						variants={product.variants}
						handleProductDetail={handleProductDetail}
						product={product}
						onQuantityChange={setQuantity}
					/>
				</div>
			</div>
		</div>
	)
}
export default ProductQuickView
