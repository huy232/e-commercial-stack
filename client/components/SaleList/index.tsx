import { DiscountedProductsResponse } from "@/types"
import React from "react"
import { CustomImage, ProductCard } from "@/components"

interface SaleListProps {
	saleList: DiscountedProductsResponse
}

const SaleList = ({ saleList }: SaleListProps) => {
	return (
		<div>
			<h2 className="font-bebasNeue text-2xl font-bold mb-4">
				Products on Sale
			</h2>
			{saleList.success ? (
				<ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-center my-4">
					{saleList.data.percentageDiscountProducts.length > 0 && (
						<h3 className="col-span-full text-xl font-semibold mb-2 font-bebasNeue text-right">
							Percentage Discount Products
						</h3>
					)}
					{saleList.data.percentageDiscountProducts.map((product) => (
						<li key={product._id} className="mb-2 mx-auto">
							<ProductCard product={product} enableOptions={true} />
						</li>
					))}
					{saleList.data.fixedDiscountProducts.length > 0 && (
						<h3 className="col-span-full text-xl font-semibold mb-2 font-bebasNeue text-right">
							Fixed Discount Products
						</h3>
					)}
					{saleList.data.fixedDiscountProducts.map((product) => (
						<li key={product._id} className="mb-2 mx-auto">
							<ProductCard product={product} enableOptions={true} />
						</li>
					))}
				</ul>
			) : (
				<p>No products on sale at the moment.</p>
			)}
		</div>
	)
}

export default SaleList
