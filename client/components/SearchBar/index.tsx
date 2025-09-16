"use client"
import { FC, useCallback } from "react"
import { useForm } from "react-hook-form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components"
import { CiSearch } from "@/assets/icons"

const SearchBar: FC = () => {
	const searchProductParams = useSearchParams()
	const { replace } = useRouter()
	const { register, handleSubmit } = useForm()

	const handleSearch = useCallback(
		async (event: any) => {
			const { search } = event
			const params = new URLSearchParams(searchProductParams)

			if (search) {
				params.set("search", search)
			} else {
				params.delete("search")
			}
			params.set("page", "1")
			replace(`/products?${params.toString()}`)
		},
		[replace, searchProductParams]
	)

	return (
		<motion.form
			initial={{ opacity: 0, y: 8 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.4, ease: "easeOut" }}
			className="relative flex items-center w-full mx-auto group"
			onSubmit={handleSubmit(handleSearch)}
		>
			{/* Input */}
			<input
				id="search"
				type="search"
				placeholder="Search for products..."
				className="w-full h-11 pl-10 pr-4 text-sm rounded-xl border border-gray-200 
					bg-white shadow-sm text-gray-700 placeholder-gray-400
					focus:ring-2 focus:ring-blue-400 focus:border-blue-400 
					transition-all duration-300"
				{...register("search")}
				name="search"
			/>

			<label
				htmlFor="search"
				className="absolute p-0 border-0 h-[1px] w-[1px] overflow-hidden"
			>
				Search for products
			</label>

			<Button
				type="submit"
				className="absolute left-2 flex items-center justify-center h-7 w-7 
					rounded-full bg-blue-500 text-white shadow-md 
					hover:bg-red-500 hover:shadow-lg transition-all duration-500"
				aria-label="Search for products"
			>
				<CiSearch size={18} />
			</Button>
		</motion.form>
	)
}

export default SearchBar
