"use client"
import { FC, useState } from "react"
import { ProductType } from "@/types"
import { CustomImage, LoadingSpinner } from "@/components"
import { productTableHeaders, roleSelection, tableHeaders } from "@/constant"
import moment from "moment"
import clsx from "clsx"
import { formatPriceNumber } from "../../../utils/formatPrice"
import { FaPlusCircle, MdDelete, MdEdit } from "@/assets/icons"
import Link from "next/link"
import { removeProduct } from "@/app/api"

interface ProductTableRowProps {
	productList: ProductType[] | []
	onProductListChange: () => void
}

const ProductTableRow: FC<ProductTableRowProps> = ({
	productList,
	onProductListChange,
}) => {
	const [loadingRemove, setLoadingRemove] = useState<string[]>([])

	const tdClass = (additionClassName?: string) =>
		clsx("px-1 py-1 align-middle", additionClassName)
	const buttonClass = clsx(`text-orange-600 h-full hover-effect`)

	const handleRemoveProduct = async (product_id: string, index: number) => {
		setLoadingRemove((prevState) => [...prevState, index.toString()])
		try {
			await removeProduct(product_id)
		} catch (error) {
			console.error("Error removing product:", error)
		} finally {
			setLoadingRemove((prevState) =>
				prevState.filter((item) => item !== index.toString())
			)
			onProductListChange()
		}
	}

	return (
		<table className="table-auto mb-6 text-left w-full">
			<thead className="font-bold bg-gray-700 text-[13px] text-white">
				<tr className="border border-blue-300">
					{productTableHeaders.map((header, index) => (
						<th key={index} className="px-1 py-2">
							{header}
						</th>
					))}
				</tr>
			</thead>
			<tbody className="text-left">
				{productList.map((product, index) => (
					<tr key={product._id} className="border border-gray-500 text-sm">
						<td className={tdClass()}>{index + 1}</td>
						<td className={tdClass()}>
							<CustomImage
								src={product.thumbnail}
								width={60}
								height={60}
								alt={product.title}
							/>
						</td>
						<td className={tdClass(`line-clamp-2 w-[120px]`)}>
							{product.title}
						</td>
						<td className={tdClass(`text-xs`)}>{product.category[1]}</td>
						<td className={tdClass(`text-xs`)}>{product.brand}</td>
						<td className={tdClass(`text-xs`)}>
							{formatPriceNumber(product.price)}
						</td>
						<td className={tdClass(`text-xs`)}>{product.quantity}</td>
						<td className={tdClass(`text-xs`)}>
							{moment(product.createdAt).fromNow()}
						</td>
						<td className={tdClass("h-full")}>
							<div className="flex gap-1">
								<Link
									href={`/admin/update-product/${product.slug}`}
									className={buttonClass}
								>
									<MdEdit />
								</Link>
								{loadingRemove.includes(index.toString()) ? (
									<button className="h-full" disabled>
										<LoadingSpinner size={4} />
									</button>
								) : (
									<button
										className={buttonClass}
										onClick={() => handleRemoveProduct(product._id, index)}
									>
										<MdDelete />
									</button>
								)}
								<Link
									className={buttonClass}
									href={`/admin/variants/${product.slug}`}
								>
									<FaPlusCircle />
								</Link>
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default ProductTableRow
