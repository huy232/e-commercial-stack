"use client"
import { FC, useState } from "react"
import { ProductType, Users } from "@/types"
import { FieldError, FieldErrors, useForm } from "react-hook-form"
import { CustomImage, InputForm, UpdateProduct } from "@/components"
import { productTableHeaders, roleSelection, tableHeaders } from "@/constant"
import moment from "moment"
import clsx from "clsx"
import { formatPriceNumber } from "../../../utils/formatPrice"
import { MdDelete, MdEdit } from "@/assets/icons"
import Link from "next/link"

interface CustomFieldError extends FieldError {
	message: string
}

interface ProductTableRowProps {
	productList: ProductType[] | []
	onProductListChange: () => void
}

const ProductTableRow: FC<ProductTableRowProps> = ({
	productList,
	onProductListChange,
}) => {
	const [editElement, setEditElement] = useState<ProductType | null>(null)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const tdClass = (additionClassName?: string) =>
		clsx("px-1 py-1 align-middle", additionClassName)

	return (
		<form>
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
										className="text-orange-600 h-full"
									>
										<MdEdit />
									</Link>
									<button className="text-orange-600 h-full">
										<MdDelete />
									</button>
								</div>
							</td>
						</tr>
					))}
				</tbody>
			</table>
		</form>
	)
}

export default ProductTableRow
