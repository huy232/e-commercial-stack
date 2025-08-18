"use client"

import { IoIosCloseCircle } from "@/assets/icons"
import { Button, ProductCart, ProductSlider } from "@/components"
import { handleCreateUserCart } from "@/store/actions"
import {
	AppDispatch,
	ProductExtraType,
	ProductType,
	VariantType,
} from "@/types"
import {
	discountLabel,
	discountValidate,
	formatPrice,
	renderStarFromNumber,
} from "@/utils"
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
			handleCreateUserCart({
				product_id: product._id,
				variant_id: variant?._id || null,
				quantity,
			})
		)
	}
	const discountLabel = (discount: { type: string; value: number }) => {
		if (discount.type === "percentage") {
			return (
				<div className="text-xs p-1">
					<span>Percentage sale: </span>
					<span>{discount.value}%</span>
				</div>
			)
		}
		if (discount.type === "fixed") {
			return (
				<div className="text-xs p-1">
					<span>Fixed price sale: </span>
					<span>-{formatPrice(discount.value)}</span>
				</div>
			)
		}
	}

	return (
		<div className="w-full h-full lg:h-[70vh] lg:w-[70vw] flex flex-col lg:flex-row">
			{/* <Button
				className="absolute top-0 right-0 hover:opacity-80 duration-300 ease-linear"
				onClick={onClose}
			>
				<IoIosCloseCircle size={24} />
			</Button> */}
			<div className="w-full lg:w-3/5">
				<ProductSlider images={product.images} />
			</div>
			<div className="w-full lg:w-2/5 h-full overflow-y-auto">
				<h2 className="line-clamp-2 text-xl font-bold font-bebasNeue">
					{product.title}
				</h2>
				<span className="flex">
					{renderStarFromNumber(product.totalRatings)}
				</span>
				{discountValidate(product) ? (
					<div className="flex flex-col">
						<span className="line-through text-gray-500 text-xs">
							{formatPrice(product.price)}
						</span>
						<span className="text-green-500 text-sm">
							{formatPrice(product.discount.productPrice)}
						</span>
						{discountLabel(product.discount)}
					</div>
				) : (
					<span className="text-sm text-green-500">
						{formatPrice(product.price)}
					</span>
				)}
				<span className="text-xs block">Available: {product.quantity}</span>
				<span className="text-xs block">Sold: 100</span>
				<span
					className="line-clamp-2 lg:line-clamp-5 text-sm"
					dangerouslySetInnerHTML={{ __html: product.description }}
				/>
				<div className="flex flex-col gap-4">
					<ProductCart
						variants={product.variants}
						handleProductDetail={handleProductDetail}
						product={product}
						setQuantity={setQuantity}
						quantity={quantity}
					/>
				</div>
			</div>
		</div>
	)
}
export default ProductQuickView
