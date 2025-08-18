"use client"

import { FaCircleXmark, FaRegSquarePlus, FaWindowClose } from "@/assets/icons"
import { Button, showToast } from "@/components"
import { API } from "@/constant"
import { CategoryType } from "@/types"
import { inputClass } from "@/utils"
import { FC, useState } from "react"
import { size } from "@floating-ui/react"

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
		<div className="lg:w-[480px] mt-6 lg:mt-0">
			<div className="relative max-w-sm min-w-[200px] mx-2 lg:mx-0">
				<label
					htmlFor="product-variant"
					className="text-base lg:text-xl italic font-semibold font-bebasNeue"
				>
					Choose a category to assign options
				</label>

				<select
					name="product-variant"
					id="product-variant"
					onChange={handleCategoryChange}
					className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"
				>
					<option className="text-gray-500 italic" value="">
						-Select a category-
					</option>
					{categories.map((category) => (
						<option value={category.title} key={category._id}>
							{category.title}
						</option>
					))}
				</select>

				{/* This icon goes outside the <select>, but is visually placed over it */}
				<svg
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 24 24"
					strokeWidth="1.2"
					stroke="currentColor"
					className="h-5 w-5 absolute top-10 right-3 pointer-events-none text-slate-700"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						d="M8.25 15 12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
					/>
				</svg>
			</div>

			{selectedCategory && (
				<>
					<div className="rounded p-1 bg-gray-500/30 shadow-sm mt-2">
						<h3 className="text-base font-anton">Available option(s)</h3>
						<div className="mx-4 my-2 flex flex-col lg:flex-row">
							<input
								type="text"
								value={newOptionType}
								onChange={(e) => setNewOptionType(e.target.value)}
								placeholder="Option type"
								className={inputClass("bg-white")}
							/>
							<button
								className="mt-2 lg:mt-0 ml-auto lg:mx-1 bg-orange-500 rounded p-1 text-sm hover:opacity-70 hover:brightness-105 duration-300 ease-linear w-fit"
								type="button"
								onClick={handleAddOption}
							>
								Add option
							</button>
						</div>
						{options.map((option, index) => (
							<div key={index} className="mt-2 relative">
								<div className="flex items-center gap-1">
									<h4 className="font-semibold text-xl font-bebasNeue mx-2">
										{option.type}
									</h4>
									<div className="ml-auto flex items-center gap-2 mx-1">
										<button
											className="bg-green-500 hover:opacity-70 hover:brightness-105 duration-300 ease-linear mx-0.5 p-1 rounded flex flex-row items-center justify-center gap-1 text-black w-[90px]"
											type="button"
											onClick={() => handleAddValue(index)}
										>
											<span className="text-sm">Value</span>
											<FaRegSquarePlus size={20} className="mt-[3px]" />
										</button>
										<button
											className="bg-red-500 hover:opacity-70 hover:brightness-105 duration-300 ease-linear mx-0.5 p-1 rounded flex flex-row items-center justify-center gap-1 text-black w-[90px]"
											type="button"
											onClick={() => handleRemoveOption(index)}
										>
											<span className="text-sm">Remove</span>
											<FaCircleXmark size={22} className="mt-[3px]" />
										</button>
									</div>
								</div>
								<div className="bg-gray-500/50 shadow-md rounded p-2 mx-4 mt-2">
									{option.value.map((val, valIndex) => (
										<div key={valIndex} className="mt-2">
											<input
												type="text"
												value={val}
												onChange={(e) =>
													handleValueInputChange(
														index,
														valIndex,
														e.target.value
													)
												}
												className={inputClass("bg-white")}
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
							</div>
						))}
					</div>
					<div className="text-right">
						<Button
							className="bg-rose-500 p-1 rounded hover:brightness-125 hover:opacity-90 duration-300 ease-in-out text-white hover:bg-transparent hover:border-rose-500 border-transparent border-[2px] hover:text-black w-fit lg:w-[120px] ml-auto mt-2 mx-2"
							type="button"
							onClick={handleSubmit}
						>
							Submit
						</Button>
					</div>
				</>
			)}
		</div>
	)
}

export default VariantForm
