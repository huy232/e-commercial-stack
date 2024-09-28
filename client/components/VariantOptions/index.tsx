"use client"
import { FC, useState } from "react"
import { InputField } from "@/components"
import { FieldValues, useForm } from "react-hook-form"
import { CategoryType } from "@/types"

interface Option {
	type: string
	value: string[]
}

interface Variant {
	[key: string]: string | number
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
	// Initialize form with variant fields as default values
	const {
		register,
		formState: { errors },
		reset,
	} = useForm<FieldValues>({
		defaultValues: variantFields.length > 0 ? variantFields : [],
	})

	const [checkedOptions, setCheckedOptions] = useState<string[]>(
		variantFields.length > 0
			? Object.keys(variantFields[0]).filter(
					(key) => key !== "price" && key !== "stock" && key !== "_id"
			  )
			: []
	)
	const [variantsCreated, setVariantsCreated] = useState(
		variantFields.length > 0
	)

	const categoryOptions: Option[] | undefined = categories.find(
		(cat: CategoryType) => cat._id === category
	)?.option

	// Helper function to create a blank new variant object
	const createBlankVariant = () => {
		const newVariant: Variant = {}
		const selectedOptions = categoryOptions?.filter((option) =>
			checkedOptions
				.map((opt) => opt.toLowerCase())
				.includes(option.type.toLowerCase())
		)

		selectedOptions?.forEach((option) => {
			newVariant[option.type] = option.value[0]
		})
		newVariant.price = 0
		newVariant.stock = 0
		return newVariant
	}

	const handleCreateVariant = () => {
		const newVariant = {
			price: 0,
			stock: 0,
			...createBlankVariant(), // Add other default options
		}
		setVariantFields([...variantFields, newVariant])
		reset()
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
		const numericValue = value.replace(/[^\d.-]/g, "") // Remove non-numeric characters like commas
		const updatedFields = [...variantFields]
		updatedFields[variantIndex].price = Number(numericValue)
		setVariantFields(updatedFields)
	}

	const handleSelectChange = (
		variantIndex: number,
		type: string,
		value: string
	) => {
		const updatedFields = [...variantFields]
		updatedFields[variantIndex][type] = value
		setVariantFields(updatedFields)
	}

	const handleStockChange = (variantIndex: number, value: string) => {
		const numericValue = value.replace(/[^\d.-]/g, "") // Remove non-numeric characters
		const updatedFields = [...variantFields]
		updatedFields[variantIndex].stock = Number(numericValue)
		setVariantFields(updatedFields)
	}

	return (
		<div>
			{categoryOptions &&
				categoryOptions.map((option) => (
					<div key={option.type}>
						<input
							type="checkbox"
							id={option.type}
							checked={checkedOptions
								.map((opt) => opt.toLowerCase())
								.includes(option.type.toLowerCase())}
							onChange={(e) =>
								handleCheckboxChange(option.type, e.target.checked)
							}
							disabled={variantsCreated}
						/>
						<label htmlFor={option.type}>{option.type}</label>
					</div>
				))}
			{checkedOptions.length > 0 && (
				<button
					onClick={handleCreateVariant}
					className="rounded bg-green-500 p-1 m-1 text-xs"
					type="button"
				>
					Create Variant
				</button>
			)}
			{variantFields.map((variant, index) => (
				<div
					key={index}
					className="border-2 rounded border-solid border-black p-1 m-1"
				>
					<button
						onClick={() => handleDeleteVariant(index)}
						className="rounded bg-red-500 p-1 m-1 text-xs hover-effect"
						type="button"
					>
						Delete Variant
					</button>
					{Object.entries(variant).map(
						([type, value]) =>
							type !== "_id" && (
								<div key={`${type}-${index}`}>
									{type === "price" || type === "stock" ? (
										<InputField
											label={type}
											name={`${type}-${index}`}
											register={register}
											required={`${type}-${index} is required`}
											validateType={"onlyNumbers"}
											errorMessage={
												errors[type] &&
												(errors[type]?.message?.toString() ||
													`Please enter a valid ${type}.`)
											}
											value={value === null ? "" : value?.toString()}
											onChange={(e) => {
												if (type === "price") {
													handlePriceChange(index, e.target.value)
												} else if (type === "stock") {
													handleStockChange(index, e.target.value)
												}
											}}
										/>
									) : (
										<div>
											<label
												className="capitalize"
												htmlFor={`${type}-${index}`}
											>
												{type}
											</label>
											<select
												value={value as string}
												onChange={(e) =>
													handleSelectChange(index, type, e.target.value)
												}
											>
												{categoryOptions
													?.find(
														(option) =>
															option.type.toLowerCase() === type.toLowerCase()
													)
													?.value.map((option: string) => (
														<option key={option} value={option}>
															{option}
														</option>
													))}
											</select>
										</div>
									)}
								</div>
							)
					)}
				</div>
			))}
		</div>
	)
}

export default VariantOptions
