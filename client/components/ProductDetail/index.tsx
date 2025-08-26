"use client"
import { discountValidate, formatPrice, renderStarFromNumber } from "@/utils"
import {
	Breadcrumb,
	Button,
	CustomSlider,
	ProductCart,
	ProductExtraInfo,
	ProductInformation,
	ProductSlider,
} from "@/components"
import { FC, useEffect, useRef, useState } from "react"
import { ProductExtraType, ProductType, VariantType } from "@/types/product"
import { productExtraInformation, WEB_URL } from "@/constant"
import { handleCreateUserCart } from "@/store/actions/"
import { useDispatch } from "react-redux"
import { AppDispatch } from "@/types"
import moment from "moment"
import { FaAngleDoubleDown, FaAngleDoubleUp } from "@/assets/icons"
import clsx from "clsx"

interface ProductDetailProps {
	product: ProductExtraType
	relatedProducts: ProductExtraType[]
}

const ProductDetail: FC<ProductDetailProps> = ({
	product,
	relatedProducts,
}) => {
	const dispatch = useDispatch<AppDispatch>()
	const [quantity, setQuantity] = useState<number>(1)
	const [extendDescription, setExtendDescription] = useState<boolean>(false)
	const [descriptionHeight, setDescriptionHeight] = useState<number | null>(
		null
	)
	const descriptionRef = useRef<HTMLDivElement>(null)
	useEffect(() => {
		if (descriptionRef.current) {
			setDescriptionHeight(descriptionRef.current.scrollHeight)
		}
	}, [product.description])

	let breadcrumbs = [{ name: "Home", slug: "/" }]
	if (product.category) {
		breadcrumbs.push({
			name: product.category.title,
			slug: `/products?category=${product.category.slug}`,
		})
	}
	const updateReviews = async () => {
		const productResponse = await fetch(
			WEB_URL + "/api/product/" + product.slug,
			{
				method: "GET",
			}
		)
		const { data } = await productResponse.json()
		return data
	}

	const handleProductDetail = async (variant: VariantType | null) => {
		await dispatch(
			handleCreateUserCart({
				product_id: product._id,
				variant_id: variant ? variant._id : null,
				quantity,
			})
		)
	}
	const discountLabel = (discount: {
		type: string
		value: number
		expirationDate: Date
		productPrice: number
	}) => {
		if (discount.type) {
			return (
				<div className="w-full flex justify-between items-center">
					<span className="text-[12px] text-[#78716C] italic font-base">
						{discount.type === "percentage" && (
							<span>
								{discount.value}% <span className="font-semibold">Now</span>
							</span>
						)}
						{discount.type === "fixed" && (
							<span>
								-{formatPrice(discount.value)}
								<span className="font-semibold ml-0.5">Now</span>
							</span>
						)}
					</span>
					<span className="text-[12px] italic font-bold">
						End: {moment(discount.expirationDate).format("DD-MM-YYYY")}
					</span>
				</div>
			)
		}
	}
	return (
		<>
			<section className="w-full xl:w-main flex flex-col max-sm:items-center">
				<Breadcrumb
					breadcrumbs={breadcrumbs}
					productTitle={product.title}
					allowTitle={true}
				/>
			</section>
			<section className="mx-auto flex flex-col lg:flex-row mt-4">
				<div className="lg:w-2/5 flex flex-col gap-4">
					<ProductSlider images={product.images} />
				</div>
				<div className="lg:w-2/5 flex flex-col mx-2">
					<div className="flex flex-col gap-2">
						<h2 className="max-sm:text-center max-sm:line-clamp-none max-sm:text-2xl order-2 text-lg font-semibold font-anton line-clamp-2">
							{product.title}
						</h2>
						<span className="order-3 flex items-center justify-between">
							<span className="flex items-center">
								{renderStarFromNumber(product.totalRatings, 24)}
							</span>
							<span className="italic text-sm">100 sold</span>
						</span>

						{discountValidate(product) ? (
							<div className="order-1 bg-[#84CC16] w-full px-2 py-2 rounded leading-3 flex flex-col">
								<div className="flex items-center gap-1">
									<span className="text-white max-sm:text-base text-lg font-bold">
										{formatPrice(product.discount.productPrice)}
									</span>
									<span className="md:block line-through text-gray-500 text-[10px]">
										{formatPrice(product.price)}
									</span>
								</div>
								{discountLabel(product.discount)}
							</div>
						) : (
							<span className="order-1 bg-red-500 lg:bg-transparent w-full px-2 lg:px-0 py-2 rounded lg:leading-3 text-xl font-bold text-white lg:text-green-500 mt-2">
								{formatPrice(product.price)}
							</span>
						)}
						<div className="order-4 text-sm w-full my-2">
							<div className="flex w-full flex-between">
								<span className="w-full">Available</span>
								<span className="italic mr-2">{product.quantity}</span>
							</div>
							<div className="flex w-full flex-between">
								<span className="w-full">Variants support</span>
								<span className="italic mr-2">
									{product.allowVariants ? "Yes" : "No"}
								</span>
							</div>
							<div></div>
						</div>
					</div>
					<div className="flex flex-col gap-0 lg:gap-2">
						<ProductCart
							variants={product.variants}
							handleProductDetail={handleProductDetail}
							product={product}
							setQuantity={setQuantity}
							quantity={quantity}
						/>
					</div>
				</div>
				<div className="lg:w-1/5 grid gap-1 max-sm:my-2 max-sm:mx-auto">
					{productExtraInformation.map((extra) => (
						<ProductExtraInfo
							key={extra.id}
							title={extra.title}
							description={extra.description}
							icon={extra.icon}
						/>
					))}
				</div>
			</section>
			<div className="w-full xl:w-main m-auto mt-2 lg:mt-4">
				<div
					ref={descriptionRef}
					className={clsx(
						"mb-2 px-1 transition-all ease-in-out duration-500 overflow-hidden mx-2"
					)}
					dangerouslySetInnerHTML={{ __html: product.description }}
					style={{
						maxHeight: extendDescription ? `${descriptionHeight}px` : "150px",
						WebkitLineClamp: extendDescription ? "none" : "5",
					}}
				/>
				<div className="w-fit mx-auto">
					{
						<Button
							onClick={() => {
								setExtendDescription(!extendDescription)
							}}
							className="flex items-center gap-1 justify-center bg-red-500 rounded py-1 px-2 text-white hover:opacity-90 duration-300 ease-in-out transition-all group"
						>
							{extendDescription ? (
								<>
									<span>View less</span>
									<FaAngleDoubleUp className="group-hover:animate-pulse" />
								</>
							) : (
								<>
									<span>View more</span>
									<FaAngleDoubleDown className="group-hover:animate-pulse" />
								</>
							)}
						</Button>
					}
				</div>
				<ProductInformation product={product} updateReviews={updateReviews} />
			</div>
			{relatedProducts && (
				<div className="w-full xl:w-main m-auto my-4">
					<h3 className="text-[20px] font-semibold py-[15px] border-b-2 border-main mx-2 mt-4 font-bebasNeue max-sm:text-center">
						Other products you may like
					</h3>
					<div className="w-full xl:w-main m-auto">
						<CustomSlider
							products={relatedProducts}
							supportHover
							supportDetail
						/>
					</div>
				</div>
			)}
		</>
	)
}
export default ProductDetail
