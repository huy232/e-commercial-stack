"use client"
import { FC, useState } from "react"
import { filterCategory } from "@/constant/"
import { InputField } from "@/components"
import { FieldValues, useForm } from "react-hook-form"
import { CategoryType, ProductCategory } from "@/types"

interface Option {
	type: string
	value: string[]
}

interface Variant {
	[key: string]: string | number
}

interface VariantOptionsProps {
	category: string
	variantFields: any[]
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
		setValue,
	} = useForm<FieldValues>()

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

	console.log("Category in variant option: ", category)
	console.log("Categories: ", categories)

	const categoryOptions: Option[] | undefined = categories.find(
		(cat: CategoryType) => cat.title === category
	)?.option

	const handleCreateVariant = () => {
		// Filter out the options based on checkedOptions
		const selectedOptions = categoryOptions?.filter((option) =>
			checkedOptions
				.map((opt) => opt.toLowerCase())
				.includes(option.type.toLowerCase())
		)

		// Create a new variant based on selected options
		const newVariant: Variant = {}
		selectedOptions?.forEach((option) => {
			newVariant[option.type] = option.value[0]
		})
		newVariant.price = 0
		newVariant.stock = 0
		// Add the new variant to the existing variantFields
		setVariantFields([...variantFields, newVariant])

		setVariantsCreated(true)
	}

	const handleDeleteVariant = (index: number) => {
		const updatedFields = [...variantFields]
		updatedFields.splice(index, 1)
		setVariantFields(updatedFields)

		// Enable the checkboxes once all variants are deleted
		if (updatedFields.length === 0) {
			setVariantsCreated(false)
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
		const updatedFields = [...variantFields]
		updatedFields[variantIndex].price = Number(value)
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
		const updatedFields = [...variantFields]
		updatedFields[variantIndex].stock = value
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
			<button
				onClick={handleCreateVariant}
				className="rounded bg-green-500 p-1 m-1 text-xs"
				type="button"
			>
				Create Variant
			</button>
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
								<div key={type}>
									{type === "price" || type === "stock" ? (
										<div>
											<InputField
												label={type.charAt(0).toUpperCase() + type.slice(1)}
												name={`${type}-${index}`}
												register={register}
												required={`${type} is required`}
												validateType={"onlyNumbers"}
												errorMessage={
													errors[type] &&
													(errors[type]?.message?.toString() ||
														`Please enter a valid ${type}.`)
												}
												value={variant[type] as number | string}
												onChange={(e) => {
													if (type === "price") {
														handlePriceChange(index, e.target.value)
													} else if (type === "stock") {
														handleStockChange(index, e.target.value)
													}
												}}
											/>
										</div>
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
												{(
													categoryOptions?.find(
														(option) =>
															option.type.toLowerCase() === type.toLowerCase()
													)?.value || []
												).map((option: string) => (
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
