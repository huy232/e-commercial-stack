"use client"
import { FC, memo, useState, useEffect, useMemo, useCallback } from "react"
import { Button, ProductQuantity } from "@/components"
import { ProductType, VariantType } from "@/types"

interface ProductCartProps {
	variants?: VariantType[]
	product: ProductType
	handleProductDetail: (variant: VariantType | null) => void
	onQuantityChange: (quantity: number) => void
}

const ProductCart: FC<ProductCartProps> = ({
	variants = [],
	handleProductDetail,
	product,
	onQuantityChange,
}) => {
	const variantType = useMemo(
		() =>
			product.allowVariants && product.variants
				? Object.keys(product.variants[0]).filter(
						(variantKey) =>
							variantKey !== "price" &&
							variantKey !== "stock" &&
							variantKey !== "_id"
				  )
				: [],
		[product.allowVariants, product.variants]
	)

	const getUniqueValues = useCallback(
		(key: keyof VariantType) => {
			if (product.variants) {
				return Array.from(
					new Set(product.variants.map((variant) => variant[key]))
				)
			}
			return []
		},
		[product.variants]
	)

	const variantList = useMemo(
		() =>
			variantType.map((type) => ({
				type,
				values: getUniqueValues(type as keyof VariantType),
			})),
		[getUniqueValues, variantType]
	)

	const [selectedValues, setSelectedValues] = useState<Partial<VariantType>>({})
	const [quantity, setQuantity] = useState(1)
	const [allowQuantityButton, setAllowQuantityButton] = useState(false)
	const [quantityLimit, setQuantityLimit] = useState(1)

	const handleSelect = (type: keyof VariantType, value: any) => {
		setSelectedValues((prev) => ({
			...prev,
			[type]: prev[type] === value ? undefined : value,
		}))
	}

	const filteredVariants = useMemo(
		() =>
			product.variants
				? product.variants.filter((variant) =>
						Object.entries(selectedValues).every(
							([key, value]) => variant[key as keyof VariantType] === value
						)
				  )
				: [],
		[product.variants, selectedValues]
	)

	useEffect(() => {
		if (!product.allowVariants) {
			setAllowQuantityButton(product.quantity > 0)
			setQuantityLimit(Math.min(product.quantity, 99))
		} else if (filteredVariants.length === 1) {
			const stock = filteredVariants[0].stock
			setAllowQuantityButton(stock > 0)
			setQuantityLimit(Math.min(stock, 99))
		} else {
			setAllowQuantityButton(false)
			setQuantityLimit(1)
		}
	}, [product, filteredVariants])

	// Call onQuantityChange whenever quantity changes
	useEffect(() => {
		onQuantityChange(quantity)
	}, [quantity, onQuantityChange])

	const isSelectedVariantComplete = () => {
		return variantType.every(
			(type) => selectedValues[type as keyof VariantType]
		)
	}

	return (
		<>
			{variants.length > 0 && (
				<div className="grid auto-cols-[minmax(0,_2fr)] gap-4">
					{variantList.map((variant, index) => (
						<div key={index}>
							<label htmlFor="" className="font-medium capitalize">
								{variant.type}
							</label>
							{variant.values.map((variantValue) => (
								<Button
									key={variantValue}
									className={`border p-2 rounded ${
										selectedValues[variant.type as keyof VariantType] ===
										variantValue
											? "bg-blue-500 text-white"
											: ""
									}`}
									onClick={() =>
										handleSelect(
											variant.type as keyof VariantType,
											variantValue
										)
									}
								>
									{variantValue}
								</Button>
							))}
						</div>
					))}
				</div>
			)}
			{(product.allowVariants
				? isSelectedVariantComplete() && filteredVariants.length === 1
				: true) && (
				<>
					<ProductQuantity
						quantity={quantity}
						setQuantity={setQuantity}
						allowQuantity={allowQuantityButton}
						quantityLimit={quantityLimit}
					/>
					<Button
						className="w-full bg-rose-500 text-white hover:opacity-80 hover-effect p-2 rounded"
						onClick={() =>
							handleProductDetail(
								product.allowVariants ? filteredVariants[0] : null
							)
						}
					>
						Add to cart
					</Button>
					{product.allowVariants && filteredVariants.length === 1 && (
						<div className="mt-4">
							<h4 className="font-medium">Selected Variant:</h4>
							<pre>{JSON.stringify(filteredVariants[0], null, 2)}</pre>
						</div>
					)}
				</>
			)}
		</>
	)
}

export default memo(ProductCart)
