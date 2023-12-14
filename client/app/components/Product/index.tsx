import { ProductType } from "@/types/product"
import { FC } from "react"
import { CustomImage } from "@/app/components/CustomImage"

interface ProductProps {
	product: ProductType
}
export const Product: FC<ProductProps> = ({ product }) => {
	return (
		<div className="w-1/3">
			<CustomImage
				src={product.images[0] || ""}
				alt={product.title}
				className="w-full object-contain"
			/>
		</div>
	)
}
