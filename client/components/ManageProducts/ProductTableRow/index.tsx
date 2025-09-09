"use client"
import { FC, useState } from "react"
import { ProductExtraType, ProductType } from "@/types"
import {
	Checkbox,
	CustomImage,
	LoadingSpinner,
	SortableTableHeader,
	Button,
} from "@/components"
import { WEB_URL, productHeaders, sortableProductFields } from "@/constant"
import moment from "moment"
import clsx from "clsx"
import { MdDelete, MdEdit } from "@/assets/icons"
import Link from "next/link"
import { formatPrice } from "@/utils"

interface ProductTableRowProps {
	productList: ProductExtraType[] | []
	onProductListChange: () => void
}

const ProductTableRow: FC<ProductTableRowProps> = ({
	productList,
	onProductListChange,
}) => {
	const currentDate = new Date()
	const [loadingRemove, setLoadingRemove] = useState<string[]>([])

	const tdClass = (additionClassName?: string) =>
		clsx("lg:px-1 lg:py-1 align-middle", additionClassName)
	const buttonClass = clsx(
		`flex flex-inline flex-row items-center gap-0.5 hover:bg-black/60 hover:bg-opacity-60 duration-300 ease-in-out hover:text-white rounded p-1 text-orange-600 h-full border-[1px] border-orange-600`
	)

	const handleRemoveProduct = async (product_id: string, index: number) => {
		setLoadingRemove((prevState) => [...prevState, index.toString()])
		try {
			await fetch(WEB_URL + `/api/product/delete-product/` + product_id, {
				method: "DELETE",
				credentials: "include",
			})
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
		<table className="block lg:table lg:table-auto lg:mb-6 lg:text-left lg:w-full">
			<SortableTableHeader
				headers={productHeaders}
				sortableFields={sortableProductFields}
			/>

			<tbody className="grid grid-cols-1 md:grid-cols-2 w-full lg:table-row-group text-left gap-4">
				{productList.map((product, index) => (
					<tr
						key={product._id}
						className="flex flex-col lg:table-row text-sm my-4"
					>
						<td className={tdClass(`hidden lg:table-cell`)}>{index + 1}</td>
						<td className={tdClass(``)}>
							<div className="flex flex-row gap-2">
								<div className="block relative w-[80px] h-[80px] md:w-[120px] md:h-[120px] lg:w-[80px] lg:h-[80px] flex-shrink-0">
									<CustomImage
										src={product.thumbnail}
										fill
										alt={product.title}
										className="w-[80px] h-[80px] md:w-[120px] md:h-[120px] lg:w-[80px] lg:h-[80px]"
									/>
								</div>
								<div className="lg:hidden">
									<span className="line-clamp-2 font-semibold">
										{product.title}
									</span>
									<span className="text-green-500 opacity-80 text-xs">
										{formatPrice(product.price)}
									</span>
									<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
										<dt className="text-xs">Category</dt>
										<dd className="text-xs bg-gray-600/30 rounded px-1 shadow-md inline w-fit">
											{product.category.title}
										</dd>
									</div>
									<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
										<dt className="text-xs">Brand</dt>
										<dd className="text-xs bg-gray-600/30 rounded px-1 shadow-md inline w-fit">
											{product.brand.title}
										</dd>
									</div>
									<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
										<dt className="text-xs">Discount</dt>
										<dd className="text-xs">
											{product.enableDiscount &&
											new Date(product.discount.expirationDate) >
												currentDate ? (
												<span className="text-green-500">Yes</span>
											) : (
												<span className="text-red-500">No</span>
											)}
										</dd>
									</div>
									<div className="grid grid-cols-[80px_auto] gap-1 mt-1 items-center">
										<dt className="text-xs">Created</dt>
										<dd className="text-xs italic text-gray-500">
											{moment(product.createdAt).fromNow()}
										</dd>
									</div>
								</div>
							</div>
						</td>
						<td
							className={tdClass(
								"hidden lg:table-cell justify-self-center w-[120px]"
							)}
						>
							<div className="w-[120px] line-clamp-2">{product.title}</div>
						</td>
						<td className={tdClass(`hidden lg:table-cell text-xs`)}>
							{product.category.title}
						</td>
						<td className={tdClass(`hidden lg:table-cell text-xs`)}>
							{product.brand.title}
						</td>
						<td className={tdClass(`hidden lg:table-cell text-xs`)}>
							{formatPrice(product.price)}
						</td>
						<td className={tdClass(`hidden lg:table-cell text-xs`)}>
							<Checkbox
								// type="checkbox"
								checked={
									product.enableDiscount &&
									new Date(product.discount.expirationDate) > currentDate
								}
								readOnly={true}
								disabled
								size={4}
							/>
						</td>
						<td className={tdClass(`hidden lg:table-cell text-xs`)}>
							{product.quantity}
						</td>
						<td className={tdClass(`hidden lg:table-cell text-xs`)}>
							{moment(product.createdAt).fromNow()}
						</td>
						<td className={tdClass("lg:justify-items-center")}>
							<div className="flex gap-1 lg:items-center lg:justify-center my-2">
								<div className="w-1/2 lg:w-auto md:w-[120px]">
									<Link
										href={`/admin/update-product/${product.slug}`}
										className={clsx(buttonClass, "justify-center")}
									>
										<span className="sm:mr-[2px] lg:hidden">Edit</span>
										<MdEdit size={22} className="mt-[3px]" />
									</Link>
								</div>
								{loadingRemove.includes(index.toString()) ? (
									<Button
										className="w-1/2 h-full lg:w-auto md:w-[120px] flex justify-center"
										disabled
										aria-disabled={true}
										aria-label="Removing product"
										role="button"
										tabIndex={0}
										data-testid={`removing-product-button-${product._id}`}
										id={`removing-product-button-${product._id}`}
									>
										<LoadingSpinner size={22} />
									</Button>
								) : (
									<Button
										className={clsx(
											buttonClass,
											"w-1/2 lg:w-auto md:w-[120px] justify-center"
										)}
										onClick={() => handleRemoveProduct(product._id, index)}
										aria-label={`Delete product titled ${product.title}`}
										disabled={loadingRemove.length > 0}
										aria-disabled={loadingRemove.length > 0}
										role="button"
										tabIndex={0}
										data-testid={`delete-product-button-${product._id}`}
										id={`delete-product-button-${product._id}`}
									>
										<span className="sm:mr-[2px] lg:hidden">Delete</span>
										<MdDelete size={22} className="mt-[3px]" />
									</Button>
								)}
							</div>
						</td>
					</tr>
				))}
			</tbody>
		</table>
	)
}

export default ProductTableRow
