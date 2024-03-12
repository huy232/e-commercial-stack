"use client"
import { FC, useState } from "react"
import { ProductType, Users } from "@/types"
import { FieldError, FieldErrors, useForm } from "react-hook-form"
import { CustomImage, InputForm } from "@/components"
import { productTableHeaders, roleSelection, tableHeaders } from "@/constant"
import moment from "moment"
import clsx from "clsx"

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
	const [editElement, setEditElement] = useState(null)
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
							<td className={tdClass()}>{product.title}</td>
							<td className={tdClass()}>{product.category[1]}</td>
							<td className={tdClass()}>{product.brand}</td>
							<td className={tdClass()}>{product.price}</td>
							<td className={tdClass()}>{product.quantity}</td>
							<td className={tdClass()}>
								{moment(product.createdAt).fromNow()}
							</td>
							<td className={tdClass("h-full")}>Actions</td>
						</tr>
					))}
				</tbody>
			</table>
		</form>
	)
}

export default ProductTableRow
