"use client"
import { FC, memo, useState } from "react"
import { Button, ProductQuantity, ProductVariantSelect } from "@/components"
import { ProductType, VariantType } from "@/types"
import { UserProductCart, updateUserCart } from "@/app/api"

interface ProductCartProps {
	variants?: VariantType[]
	product: ProductType
	handleProductDetail: (variant: VariantType | null) => void
}

const ProductCart: FC<ProductCartProps> = ({
	variants,
	handleProductDetail,
	product,
}) => {
	const [quantity, setQuantity] = useState(1)
	const [selectedVariant, setSelectedVariant] = useState<VariantType | null>(
		null
	)

	const handleVariantSelect = (variant: VariantType) => {
		if (variant === selectedVariant) {
			setSelectedVariant(null)
			handleProductDetail(null)
		} else {
			setSelectedVariant(variant)
			handleProductDetail(variant)
		}
	}

	const handleAddToCart = async (product: ProductType) => {
		console.log(product)
		// 	const addToCartResponse = await updateUserCart({
		// 		quantity: product.quantity,
		// _id: product._id,
		// thumbnail: product.thumbnail,
		// title: product.title,
		// color: product.color
		// 	})
	}

	return (
		<>
			{variants && (
				<div className="grid auto-cols-[minmax(0,_2fr)]">
					{variants.map((variant, index) => (
						<ProductVariantSelect
							key={index}
							variant={variant}
							handleVariantSelect={() => handleVariantSelect(variant)}
							isSelected={variant === selectedVariant}
						/>
					))}
				</div>
			)}
			<ProductQuantity quantity={quantity} setQuantity={setQuantity} />
			<Button
				className="w-full bg-rose-500 text-white hover:opacity-80 hover-effect p-2 rounded"
				onClick={() => handleAddToCart(product)}
			>
				Add to cart
			</Button>
		</>
	)
}

export default memo(ProductCart)
