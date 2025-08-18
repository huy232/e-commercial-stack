"use client"

import { Brand, ProductExtraType } from "@/types"
import { FC } from "react"
import ProductCard from "../ProductCard"

interface BrandProductProps {
	brandProduct: {
		success: boolean
		message: string
		data: [{ brand: Brand; products: ProductExtraType[] }]
	}
}

const BrandProduct: FC<BrandProductProps> = ({ brandProduct }) => {
	if (!brandProduct.success) {
		return <div>Can not fetch product brands</div>
	}

	return (
		<>
			<h2 className="font-bold text-3xl text-center uppercase mt-8 font-bebasNeue border-t-2 border-r-2 border-l-2 border-black inline-block w-fit mx-auto px-2">
				Brand <span className="text-red-500 italic mr-1">related</span> products
			</h2>
			{brandProduct.data.map((brandProduct, index) => (
				<div key={index} className="my-2 grid">
					<h3 className="text-xl lg:text-2xl font-bold rounded inline-block mb-2 font-anton uppercase text-center w-full">
						{brandProduct.brand.title}
					</h3>
					<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 md:gap-4 lg:gap-8 xl:gap-12 place-self-center">
						{brandProduct.products.map((product) => (
							<div key={product._id}>
								<ProductCard product={product} enableOptions={true} />
							</div>
						))}
					</div>
				</div>
			))}
		</>
	)
}
export default BrandProduct
