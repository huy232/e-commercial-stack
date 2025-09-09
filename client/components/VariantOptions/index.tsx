"use client"
import { FC, useState } from "react"
import { Button, Checkbox, InputField } from "@/components"
import { FieldValues, useForm } from "react-hook-form"
import { CategoryType } from "@/types"
import { formatPrice } from "../../utils/formatPrice"
import { FaCircleXmark } from "@/assets/icons"

interface Option {
	type: string
	value: string[]
}

interface Variant {
	price: number
	stock: number
	variant: { type: string; value: string }[]
}

interface VariantOptionsProps {
	category: string
	variantFields: any[] // Assuming this contains your stock and price at the start
	setVariantFields: React.Dispatch<React.SetStateAction<Variant[]>>
	categories: CategoryType[]
}

const VariantOptions: FC<VariantOptionsProps> = ({
	category,
	variantFields,
	setVariantFields,
	categories,
}) => {
	const {
		register,
		formState: { errors },
		reset,
	} = useForm<FieldValues>({
		defaultValues: variantFields.length > 0 ? variantFields : [],
	})
	const [checkedOptions, setCheckedOptions] = useState<string[]>(
		variantFields.length > 0
			? variantFields[0].variant.map(
					(option: { type: string; value: string }) => option.type
			  )
			: []
	)

	const [variantsCreated, setVariantsCreated] = useState(
		variantFields.length > 0
	)

	const categoryOptions: Option[] | undefined = categories.find(
		(cat: CategoryType) => cat._id === category
	)?.option
	const safeCategoryOptions = categoryOptions ?? []

	const createBlankVariant = () => {
		const newVariant: Variant = {
			price: 0,
			stock: 0,
			variant: [],
		}

		const selectedOptions = categoryOptions?.filter((option) =>
			checkedOptions
				.map((opt) => opt.toLowerCase())
				.includes(option.type.toLowerCase())
		)

		selectedOptions?.forEach((option) => {
			newVariant.variant.push({
				type: option.type,
				value: option.value[0],
			})
		})

		return newVariant
	}

	const handleCreateVariant = () => {
		const newVariant = {
			...createBlankVariant(), // Add other default options
		}
		setVariantFields([...variantFields, newVariant])
		// reset()
		setVariantsCreated(true)
	}

	const handleDeleteVariant = (index: number) => {
		const updatedFields = variantFields.filter((_, i) => i !== index)
		setVariantFields(updatedFields)

		if (updatedFields.length === 0) {
			setVariantsCreated(false)
			setCheckedOptions([]) // Clear checked options if all variants are deleted
		}
	}

	const handleCheckboxChange = (type: string, isChecked: boolean) => {
		if (isChecked) {
			setCheckedOptions([...checkedOptions, type])
		} else {
			setCheckedOptions(checkedOptions.filter((item) => item !== type))
		}
	}

	const handlePriceChange = (variantIndex: number, value: string) => {
		const numericValue = value.replace(/[^\d.-]/g, "")
		const updatedFields = [...variantFields]
		updatedFields[variantIndex].price = Number(numericValue)
		setVariantFields(updatedFields)
	}

	const handleSelectChange = (
		variantIndex: number,
		type: string,
		value: string
	) => {
		// Copy the existing variantFields to modify
		const updatedFields = [...variantFields]

		// Find the variant object at the given index
		const variant = updatedFields[variantIndex]

		// Find the specific option within the variant's `variant` array by type
		const optionIndex = variant.variant.findIndex(
			(opt: any) => opt.type === type
		)

		// Check if the option was found; update the value if it exists
		if (optionIndex !== -1) {
			variant.variant[optionIndex].value = value
		}

		// Update the state with the modified variant fields
		setVariantFields(updatedFields)
	}

	const handleStockChange = (variantIndex: number, value: string) => {
		const numericValue = value.replace(/[^\d.-]/g, "")
		const updatedFields = [...variantFields]
		updatedFields[variantIndex].stock = Number(numericValue)
		setVariantFields(updatedFields)
	}

	return (
		<div className="mx-4">
			<div className="flex flex-wrap gap-2 items-center">
				{categoryOptions &&
					categoryOptions.map((option) => (
						<div
							className="flex flex-wrap gap-1 items-center"
							key={option.type}
						>
							<Checkbox
								// type="checkbox"
								id={option.type}
								checked={checkedOptions
									.map((opt) => opt.toLowerCase())
									.includes(option.type.toLowerCase())}
								onChange={(e) =>
									handleCheckboxChange(option.type, e.target.checked)
								}
								disabled={variantsCreated}
							/>
							<label className="mb-[3px] cursor-pointer" htmlFor={option.type}>
								{option.type}
							</label>
						</div>
					))}
			</div>
			{checkedOptions.length > 0 && (
				<Button
					onClick={handleCreateVariant}
					className="rounded bg-green-500 p-1 m-1 text-xs"
					type="button"
					disabled={
						variantFields.length >=
						Math.max(
							...safeCategoryOptions
								.filter((option) =>
									checkedOptions
										.map((opt) => opt.toLowerCase())
										.includes(option.type.toLowerCase())
								)
								.map((option) => option.value.length),
							0 // default so Math.max doesn’t get -Infinity
						)
					}
					aria-label="Create variant"
					role="button"
					tabIndex={0}
					data-testid="create-variant-button"
					id="create-variant-button"
				>
					Create variant
				</Button>
			)}
			{variantFields.map((variant: Variant, index) => (
				<div
					key={index}
					className="bg-neutral-600 bg-opacity-40 shadow-xl rounded p-2 m-1 relative"
				>
					<Button
						className="bg-red-500 hover:opacity-70 hover:brightness-105 duration-300 ease-linear p-0.5 rounded flex flex-row items-center text-black hover:text-white absolute top-1 right-1"
						type="button"
						onClick={() => handleDeleteVariant(index)}
						aria-label="Delete variant"
						role="button"
						tabIndex={0}
						data-testid={`delete-variant-button-${index}`}
						id={`delete-variant-button-${index}`}
					>
						<FaCircleXmark size={22} className="mt-[3px]" />
					</Button>

					{/* Render Price and Stock Inputs */}
					<div className="flex flex-col mt-2">
						<InputField
							label="Price"
							name={`price-${index}`}
							register={register}
							required="Price is required"
							validateType="onlyNumbers"
							errorMessage={
								errors[`price-${index}`] &&
								(errors[`price-${index}`]?.message?.toString() ||
									"Please enter a valid price.")
							}
							value={variant.price?.toLocaleString()}
							onChange={(e) => handlePriceChange(index, e.target.value)}
							inputAdditionalClass="ml-1"
						/>
						<InputField
							label="Stock"
							name={`stock-${index}`}
							register={register}
							required="Stock is required"
							validateType="onlyNumbers"
							errorMessage={
								errors[`stock-${index}`] &&
								(errors[`stock-${index}`]?.message?.toString() ||
									"Please enter a valid stock quantity.")
							}
							value={variant.stock?.toLocaleString()}
							onChange={(e) => handleStockChange(index, e.target.value)}
							inputAdditionalClass="ml-1"
						/>
					</div>

					<div className="flex flex-col gap-2 mt-4">
						{/* Render Dynamic Variant Options */}
						{variant.variant.map((opt, optIndex) => (
							<div key={`${opt.type}-${index}-${optIndex}`}>
								<label
									className="capitalize min-w-[100px] inline-block"
									htmlFor={`${opt.type}-${index}`}
								>
									{opt.type}
								</label>
								<select
									value={opt.value}
									onChange={(e) =>
										handleSelectChange(index, opt.type, e.target.value)
									}
									id={`${opt.type}-${index}`}
									className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1"
								>
									{categoryOptions
										?.find(
											(option) =>
												option.type.toLowerCase() === opt.type.toLowerCase()
										)
										?.value.map((optionValue: string) => (
											<option key={optionValue} value={optionValue}>
												{optionValue}
											</option>
										))}
								</select>
							</div>
						))}
					</div>
				</div>
			))}
		</div>
	)
}

export default VariantOptions
