"use client"
import { FC, useCallback } from "react"
import { FaSearch } from "@/assets/icons"
import { Button, InputField } from "@/components"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { motion } from "framer-motion"

interface SearchFilterProps {
	title?: string
	fields: {
		label: string
		name: string
		type: "text" | "select"
		options?: { label: string; value: string }[]
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

				if (data.search) params.set("search", data.search)
				else params.delete("search")

				fields.forEach(({ name }) => {
					if (data[name]) params.set(name, data[name])
					else params.delete(name)
				})

				params.set("page", "1")
				replace(`${pathname}?${params.toString()}`)
			} catch (error) {}
		},
		[pathname, replace, searchParams, fields]
	)

	return (
		<motion.form
			initial={{ opacity: 0, y: -15 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="w-full"
			onSubmit={handleSubmit(handleSearch)}
		>
			<div className="flex flex-col gap-4 items-center p-4 bg-white/90 dark:bg-gray-800 shadow-lg rounded-2xl min-w-[220px] max-w-3xl mx-auto mb-4">
				{title && (
					<h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
						{title}
					</h2>
				)}

				{/* Search bar */}
				{/* Search bar */}
				<div className="w-full flex flex-row items-center gap-2">
					<InputField
						label="Search"
						name="search"
						register={register}
						inputAdditionalClass="flex-1 min-w-0 rounded-lg border-gray-300 focus:border-main focus:ring focus:ring-main/30 transition-all"
						labelClassName="hidden"
					/>
					<Button
						type="submit"
						className="flex items-center justify-center gap-2 border border-main bg-main text-white px-3 py-2 rounded-lg hover:shadow-md hover:scale-[1.02] transition-all duration-200 whitespace-nowrap"
						aria-label="Search for products"
						role="button"
						tabIndex={0}
						data-testid="search-filter-button"
						id="search-filter-button"
					>
						<FaSearch size={16} />
						<span className="hidden sm:inline">Search</span>
					</Button>
				</div>

				{/* Extra filters */}
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full"
				>
					{fields.map(({ label, name, type, options }) => (
						<div key={name} className="flex flex-col gap-1">
							<label
								htmlFor={name}
								className="text-sm font-medium text-gray-700 dark:text-gray-300"
							>
								{label}
							</label>
							{type === "text" ? (
								<input
									id={name}
									{...register(name)}
									className="w-full rounded-lg border-gray-300 focus:border-main focus:ring focus:ring-main/30 text-sm px-3 py-2 transition-all"
								/>
							) : type === "select" && options ? (
								<select
									id={name}
									{...register(name)}
									className="w-full rounded-lg border-gray-300 focus:border-main focus:ring focus:ring-main/30 text-sm px-3 py-2 transition-all"
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
				</motion.div>
			</div>
		</motion.form>
	)
}

export default SearchFilter
