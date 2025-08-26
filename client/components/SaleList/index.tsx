import { DiscountedProductsResponse } from "@/types"
import React from "react"
import { CustomImage, ProductCard } from "@/components"

interface SaleListProps {
	saleList: DiscountedProductsResponse
}

const SaleList = ({ saleList }: SaleListProps) => {
	return (
		<div className="w-full lg:w-4/5 mx-auto my-4 p-1 bg-white rounded shadow">
			<h2 className="text-center lg:text-left mx-1 font-bebasNeue text-2xl font-bold mb-4">
				Products on Sale
			</h2>
			{saleList.success ? (
				<ul className="">
					{saleList.data.percentageDiscountProducts.length > 0 && (
						<section className="w-full">
							<h3 className="col-span-full text-xl font-semibold mb-2 font-bebasNeue text-left lg:text-right mx-1">
								Percentage Discount Products
							</h3>
							<div className="rounded p-1 m-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-center my-4">
								{saleList.data.percentageDiscountProducts.map((product) => (
									<li key={product._id} className="mb-2 mx-auto">
										<ProductCard product={product} enableOptions={true} />
									</li>
								))}
							</div>
						</section>
					)}

					{saleList.data.fixedDiscountProducts.length > 0 && (
						<section className="w-full">
							<h3 className="col-span-full text-xl font-semibold mb-2 font-bebasNeue text-left lg:text-right mx-1">
								Fixed Discount Products
							</h3>
							<div className="rounded p-1 m-2 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 place-content-center my-4">
								{saleList.data.fixedDiscountProducts.map((product) => (
									<li key={product._id} className="mb-2 mx-auto">
										<ProductCard product={product} enableOptions={true} />
									</li>
								))}
							</div>
						</section>
					)}
				</ul>
			) : (
				<p>No products on sale at the moment.</p>
			)}
		</div>
	)
}

export default SaleList
