"use client"
import { FC, useCallback, useState } from "react"
import { useForm } from "react-hook-form"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { CiSearch } from "@/assets/icons"

const SearchBar: FC = () => {
	const searchProductParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()
	const [isFocused, setIsFocused] = useState(false)
	const [hasContent, setHasContent] = useState(false)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setHasContent(event.target.value.length > 0)
	}

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
		[pathname, replace, searchProductParams]
	)

	return (
		<form
			className="flex py-4 relative group mb-2"
			onSubmit={handleSubmit(handleSearch)}
		>
			<label
				className="absolute p-0 border-0 h-[1px] w-[1px] overflow-hidden"
				htmlFor="search"
			>
				Search for product...
			</label>
			<button
				className="top-[50%] left-0 font-bold border-0 absolute z-10 h-full"
				type="submit"
			>
				<CiSearch />
			</button>
			<input
				id="search"
				type="search"
				placeholder="Search for product"
				autoFocus
				className="border-0 text-[1rem] outline-0 w-100 py-1 pl-[30px] pr-[20px] border-rounded appearance-none absolute w-[20rem] focus:w-full transition-all duration-300 bg-gray-500 rounded"
				{...register("search")}
				name="search"
				// onFocus={() => setIsFocused(true)}
				// onBlur={() => setIsFocused(false)}
				// onChange={() => handleInputChange}
			/>
		</form>
	)
}

export default SearchBar
