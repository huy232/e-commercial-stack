"use client"

import { FaWindowClose } from "@/assets/icons"
import { showToast } from "@/components"
import { API } from "@/constant"
import { CategoryType } from "@/types"
import { FC, useState } from "react"

interface VariantFormProps {
	categories: CategoryType[]
}

const VariantForm: FC<VariantFormProps> = ({ categories }) => {
	const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(
		null
	)
	const [newOptionType, setNewOptionType] = useState<string>("")
	const [options, setOptions] = useState<{ type: string; value: string[] }[]>(
		[]
	)

	const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const category =
			categories.find((cat) => cat.title === e.target.value) || null
		setSelectedCategory(category)
		setOptions(category ? category.option : [])
	}

	const handleAddOption = () => {
		if (newOptionType) {
			setOptions([...options, { type: newOptionType, value: [] }])
			setNewOptionType("")
		}
	}

	const handleAddValue = (index: number) => {
		const updatedOptions = [...options]
		updatedOptions[index].value.push("") // Add an empty string for a new value
		setOptions(updatedOptions)
	}

	const handleValueInputChange = (
		optionIndex: number,
		valueIndex: number,
		value: string
	) => {
		const updatedOptions = [...options]
		updatedOptions[optionIndex].value[valueIndex] = value
		setOptions(updatedOptions)
	}

	const handleRemoveValue = (optionIndex: number, valueIndex: number) => {
		const updatedOptions = [...options]
		updatedOptions[optionIndex].value.splice(valueIndex, 1) // Remove value at valueIndex
		setOptions(updatedOptions)
	}

	const handleRemoveOption = (optionIndex: number) => {
		const updatedOptions = [...options]
		updatedOptions.splice(optionIndex, 1) // Remove the entire option
		setOptions(updatedOptions)
	}

	const capitalize = (text: string) => {
		return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase()
	}

	const handleSubmit = async () => {
		if (!selectedCategory) {
			showToast("Please select a category.", "error")
			return
		}

		// Check for duplicate option types (case-insensitive)
		const optionTypes = options.map((opt) => opt.type.toLowerCase())
		const hasDuplicateOptionTypes =
			new Set(optionTypes).size !== optionTypes.length
		if (hasDuplicateOptionTypes) {
			showToast("Duplicate option types are not allowed.", "error")
			return
		}

		// Check for duplicate values within each option (case-insensitive)
		for (const option of options) {
			const valueSet = new Set(option.value.map((val) => val.toLowerCase()))
			if (valueSet.size !== option.value.length) {
				showToast(`Duplicate values found in option "${option.type}".`, "error")
				return
			}
		}

		// Capitalize option types and values
		const formattedOptions = options.map((option) => ({
			type: capitalize(option.type),
			value: option.value.map((val) => capitalize(val)),
		}))

		try {
			const updateCategoryOption = await fetch(
				API + `/product-category/option/${selectedCategory._id}`,
				{
					method: "PUT",
					credentials: "include",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ option: formattedOptions }),
				}
			)

			const updateCategoryOptionResponse = await updateCategoryOption.json()

			if (updateCategoryOptionResponse.success) {
				showToast(
					updateCategoryOptionResponse.message ||
						"Options updated successfully!",
					"success"
				)
			} else {
				showToast(
					updateCategoryOptionResponse.message || "Failed to update options.",
					"error"
				)
			}
		} catch (error) {
			showToast("An error occurred. Please try again later.", "error")
			console.error("Error submitting options:", error)
		}
	}

	return (
		<div>
			<label htmlFor="product-variant">
				Choose a category to assign options
			</label>
			<select
				name="product-variant"
				id="product-variant"
				onChange={handleCategoryChange}
			>
				<option value="">Select a category</option>
				{categories.map((category) => (
					<option value={category.title} key={category._id}>
						{category.title}
					</option>
				))}
			</select>

			{selectedCategory && (
				<div>
					<h3>Options for {selectedCategory.title}</h3>
					{options.map((option, index) => (
						<div key={index}>
							<div className="rounded p-1 border-2 border-red-500">
								<h4 className="font-semibold">{option.type}</h4>
								<button
									className="bg-red-500 hover:opacity-80 duration-200 ease-linear mx-2 p-1 rounded"
									type="button"
									onClick={() => handleAddValue(index)}
								>
									Add Value
								</button>
								<button
									className="bg-green-500 hover:opacity-80 duration-200 ease-linear mx-2 p-1 rounded"
									type="button"
									onClick={() => handleRemoveOption(index)}
								>
									Remove Option
								</button>
							</div>
							{option.value.map((val, valIndex) => (
								<div key={valIndex}>
									<input
										type="text"
										value={val}
										onChange={(e) =>
											handleValueInputChange(index, valIndex, e.target.value)
										}
										placeholder={`Value ${valIndex + 1}`}
									/>
									<button
										type="button"
										onClick={() => handleRemoveValue(index, valIndex)}
										className="text-red-500 hover:opacity-80 duration-200 ease-linear mx-1 p-1"
									>
										<FaWindowClose />
									</button>
								</div>
							))}
						</div>
					))}

					<div className="mt-2">
						<input
							type="text"
							value={newOptionType}
							onChange={(e) => setNewOptionType(e.target.value)}
							placeholder="New Option Type"
						/>
						<button
							className="mx-1 bg-green-500 rounded p-1"
							type="button"
							onClick={handleAddOption}
						>
							Add Option
						</button>
					</div>
				</div>
			)}

			<button type="button" onClick={handleSubmit}>
				Submit
			</button>
		</div>
	)
}

export default VariantForm
