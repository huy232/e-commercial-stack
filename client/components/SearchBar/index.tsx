"use client"
import { FC, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CiSearch } from "@/assets/icons"

const SearchBar: FC = () => {
	const searchProductParams = useSearchParams()
	const { replace } = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const handleSearch = useCallback(
		async (event: any) => {
			try {
				const { search } = event
				const params = new URLSearchParams(searchProductParams)

				if (search) {
					params.set("search", search)
				} else {
					params.delete("search")
				}

				params.set("page", "1")
				replace(`/products?${params.toString()}`)
			} catch (error) {}
		},
		[replace, searchProductParams]
	)

	return (
		<form className="flex group h-[40px]" onSubmit={handleSubmit(handleSearch)}>
			<input
				id="search"
				type="search"
				placeholder="Search for product"
				autoFocus
				className="relative border-0 text-[1rem] outline-0 w-100 pl-[30px] pr-[20px] border-rounded appearance-none w-full transition-all duration-300 bg-gray-500 rounded h-full"
				{...register("search")}
				name="search"
			/>
			<label
				className="absolute p-0 border-0 h-[1px] w-[1px] overflow-hidden"
				htmlFor="search"
			>
				Search for product...
			</label>
			<button
				className="absolute top-0 left-0 font-bold border-0 z-10 h-full pl-[4px]"
				type="submit"
			>
				<CiSearch />
			</button>
		</form>
	)
}

export default SearchBar
