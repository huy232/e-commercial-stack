import { ProductExtraType, ProductType } from "@/types"
import { FC } from "react"
import { ProductCard } from "@/components"

interface FeatureProductsProps {
	featureProducts: any
}

const FeatureProducts: FC<FeatureProductsProps> = ({ featureProducts }) => {
	return (
		<div className="w-full grid">
			<h3 className="uppercase text-2xl font-semibold py-[15px] border-b-2 border-main xl:skew-x-12 font-bebasNeue lg:text-right text-center mx-2">
				<span className="lg:text-4xl mr-1 text-red-500">Feature</span>
				<span>products</span>
			</h3>
			<div className="my-4 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 lg:gap-8 xl:gap-12 place-self-center">
				{featureProducts ? (
					featureProducts.map((product: ProductExtraType) => (
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
