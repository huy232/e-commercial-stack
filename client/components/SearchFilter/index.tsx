"use client"
import { FC, useCallback } from "react"
import { FaSearch } from "@/assets/icons"
import { InputField } from "@/components"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"

interface SearchFilterProps {
	title?: string
	fields: {
		label: string
		name: string
		type: "text" | "select"
		options?: { label: string; value: string }[] // For select fields
	}[]
}

const SearchFilter: FC<SearchFilterProps> = ({ title, fields }) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()
	const { register, handleSubmit } = useForm()

	const handleSearch = useCallback(
		async (data: any) => {
			try {
				const params = new URLSearchParams(searchParams)

				// Ensure search field is always included
				if (data.search) {
					params.set("search", data.search)
				} else {
					params.delete("search")
				}

				fields.forEach(({ name }) => {
					if (data[name]) {
						params.set(name, data[name])
					} else {
						params.delete(name)
					}
				})

				params.set("page", "1")
				replace(`${pathname}?${params.toString()}`)
			} catch (error) {}
		},
		[pathname, replace, searchParams, fields]
	)

	return (
		<form className="w-full" onSubmit={handleSubmit(handleSearch)}>
			<div className="flex flex-col justify-center gap-2 items-center p-2 bg-gray-400/60 rounded min-w-[320px] max-w-[640px] mx-auto mb-2">
				{title && <h2 className="text-lg font-semibold">{title}</h2>}
				<div className="w-full flex flex-col gap-2">
					<div className="flex items-center gap-2">
						<InputField
							label="Search"
							name="search"
							register={register}
							inputAdditionalClass="flex-1"
							labelClassName="w-[80px]"
						/>
						<button
							type="submit"
							className="border-2 border-main hover:bg-main text-white bg-red-500 p-1 rounded-lg transition-all hover:shadow-md"
						>
							<FaSearch size={18} className="w-4 h-4" />
						</button>
					</div>

					{/* Render additional fields dynamically */}
					{fields.map(({ label, name, type, options }) => (
						<div key={name} className="flex gap-2">
							<label
								htmlFor={name}
								className="text-md font-medium mr-1 w-[80px]"
							>
								{label}
							</label>
							{type === "text" ? (
								<input
									id={name}
									{...register(name)}
									className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-main focus:border-main sm:text-sm rounded-md"
								/>
							) : type === "select" && options ? (
								<select
									id={name}
									{...register(name)}
									className="block w-fit pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-main focus:border-main sm:text-sm rounded-md"
								>
									{options.map((option) => (
										<option key={option.value} value={option.value}>
											{option.label}
										</option>
									))}
								</select>
							) : null}
						</div>
					))}
				</div>
			</div>
		</form>
	)
}

export default SearchFilter
