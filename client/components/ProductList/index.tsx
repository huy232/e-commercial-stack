"use client"
import { ProductType } from "@/types"
import { FC, useState, useEffect } from "react"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"

interface ProductsProps {
	fetchProducts: (params: {}) => Promise<ProductType[] | null>
}

const ProductList: FC<ProductsProps> = ({ fetchProducts }) => {
	const [products, setProducts] = useState([])
	const handleFetchProducts = async () => {}

	useEffect(() => {
		fetchProducts({})
	})

	return (
		<>
			<div className="w-main border p-4 flex justify-center items-center mx-auto">
				<div className="w-4/5 flex-auto">Filter</div>
				<div className="w-1/5">Sort by</div>
			</div>
			<div className="w-full h-[500px]">
				<Masonry columnsCount={3}>
					{products.map((product, index) => (
						<div key={index}>Something</div>
					))}
				</Masonry>
			</div>
		</>
	)
}
export default ProductList
