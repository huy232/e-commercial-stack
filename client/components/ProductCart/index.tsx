"use client"
import {
	FC,
	memo,
	useState,
	useEffect,
	useMemo,
	useCallback,
	Dispatch,
	SetStateAction,
} from "react"
import { Button, ProductQuantity } from "@/components"
import { ProductExtraType, VariantType } from "@/types"
import clsx from "clsx"

interface ProductCartProps {
	variants?: VariantType[]
	product: ProductExtraType
	handleProductDetail: (variant: VariantType | null) => void
	setQuantity: Dispatch<SetStateAction<number>>
	quantity: number
}

const ProductCart: FC<ProductCartProps> = ({
	variants = [],
	handleProductDetail,
	product,
	setQuantity,
	quantity,
}) => {
	const variantType = useMemo(() => {
		if (product.allowVariants && product.variants) {
			return Array.from(new Set(product.variants[0].variant.map((v) => v.type)))
		}
		return []
	}, [product.allowVariants, product.variants])

	const getUniqueValues = useCallback(
		(type: string) => {
			if (product.variants) {
				// Gather unique values for the specified type across all variants
				return Array.from(
					new Set(
						product.variants.flatMap((variant) =>
							variant.variant.filter((v) => v.type === type).map((v) => v.value)
						)
					)
				)
			}
			return []
		},
		[product.variants]
	)

	const variantList = useMemo(() => {
		return variantType.map((type) => ({
			type,
			values: getUniqueValues(type),
		}))
	}, [getUniqueValues, variantType])

	const [selectedValues, setSelectedValues] = useState<
		Record<string, string | undefined>
	>({})
	const [allowQuantityButton, setAllowQuantityButton] = useState(false)
	const [quantityLimit, setQuantityLimit] = useState(1)

	const handleSelect = (type: string, value: string) => {
		setSelectedValues((prev) => ({
			...prev,
			[type]: prev[type] === value ? undefined : value,
		}))
	}

	const filteredVariants = useMemo(() => {
		if (!product.variants) return []

		return product.variants.filter((variant) => {
			return Object.entries(selectedValues).every(
				([selectedType, selectedValue]) => {
					return variant.variant.some(
						(v) =>
							v.type.toLowerCase() === selectedType.toLowerCase() &&
							v.value.toLowerCase() === selectedValue?.toLowerCase()
					)
				}
			)
		})
	}, [product.variants, selectedValues])

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
	}, [filteredVariants, product])

	const isSelectedVariantComplete = () => {
		return variantType.every((type) => {
			return selectedValues[type as keyof VariantType]
		})
	}

	let addQuantityContent

	if (
		(product.allowVariants && isSelectedVariantComplete()) ||
		(!product.allowVariants && product.quantity)
	) {
		if (
			(filteredVariants[0] && filteredVariants[0].stock) ||
			product.quantity
		) {
			addQuantityContent = (
				<>
					<ProductQuantity
						quantity={quantity}
						setQuantity={setQuantity}
						allowQuantity={allowQuantityButton}
						quantityLimit={quantityLimit}
					/>
					<Button
						className="mx-2 lg:w-[120px] bg-rose-500 text-white hover:opacity-80 hover-effect p-2 rounded"
						onClick={() =>
							handleProductDetail(
								product.allowVariants ? filteredVariants[0] : null
							)
						}
					>
						Add to cart
					</Button>
					{/* {product.allowVariants && filteredVariants.length === 1 && (
						<div className="mt-4">
							<h4 className="font-medium">Selected Variant:</h4>
							<pre>{JSON.stringify(filteredVariants[0], null, 2)}</pre>
						</div>
					)} */}
				</>
			)
		} else addQuantityContent = <div>Product is not available</div>
	}

	return (
		<>
			{variants.length > 0 && (
				<div className="grid auto-cols-[minmax(0,_2fr)] gap-2">
					{variantList.map((variant, index) => (
						<div key={index} className="flex gap-2">
							<label htmlFor="" className="font-semibold capitalize">
								{variant.type}
							</label>
							{variant.values.map((variantValue) => (
								<Button
									key={variantValue}
									className={clsx(
										`border px-1 py-0.5 rounded`,
										selectedValues[variant.type] === variantValue &&
											"bg-blue-500 text-white"
									)}
									onClick={() =>
										handleSelect(variant.type as string, variantValue)
									}
								>
									{variantValue}
								</Button>
							))}
						</div>
					))}
				</div>
			)}
			{addQuantityContent || (
				<span className="bg-gray-400/70 text-gray-500 p-2 font-semibold rounded w-fit mx-auto lg:animate-bounce mt-2">
					Please select product variants
				</span>
			)}
		</>
	)
}

export default memo(ProductCart)
