import { ProductType } from "@/types"
import { FC } from "react"
import { ProductCard } from "@/components"

interface FeatureProductsProps {
	featureProducts: any
}

const FeatureProducts: FC<FeatureProductsProps> = ({ featureProducts }) => {
	return (
		<div className="w-full">
			<h3 className="uppercase text-lg font-semibold py-[15px] border-b-2 border-main">
				Feature products
			</h3>
			<div className="mt-4 grid grid-cols-2 md:grid-cols-3 gap-14">
				{featureProducts ? (
					featureProducts.map((product: ProductType) => (
						<ProductCard
							key={product._id}
							product={product}
							enableOptions={true}
						/>
					))
				) : (
					<div>Loading...</div>
				)}
			</div>
		</div>
	)
}

export default FeatureProducts
