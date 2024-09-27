"use client"
import { Button, InputField } from "@/components"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { FC, useCallback } from "react"
import {
	FieldValues,
	UseFormHandleSubmit,
	UseFormRegister,
	useForm,
} from "react-hook-form"

const SearchUser: FC = () => {
	const searchParamsUser = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const handleSearch = useCallback(
		async (event: any) => {
			try {
				const { search, type } = event
				const params = new URLSearchParams(searchParamsUser)
				if (search) {
					params.set("search", search)
				} else {
					params.delete("search")
				}
				if (type) {
					params.set("type", type)
				} else {
					params.delete("type")
				}
				params.set("page", "1")
				replace(`${pathname}?${params.toString()}`)
			} catch (error) {}
		},
		[pathname, replace, searchParamsUser]
	)

	return (
		<form
			className="flex justify-end py-4"
			onSubmit={handleSubmit(handleSearch)}
		>
			<InputField label="Search" name="search" register={register} />
			<div className="ml-4">
				<label
					htmlFor="type"
					className="block text-sm font-medium text-gray-700"
				>
					Type
				</label>
				<select
					id="type"
					{...register("type")}
					className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-main focus:border-main sm:text-sm rounded-md"
				>
					<option value="email">Email</option>
				</select>
			</div>
			<Button
				className="border-2 border-main hover:bg-main hover-effect rounded p-0.5 px-4 my-4"
				type="submit"
			>
				Search
			</Button>
		</form>
	)
}
export default SearchUser
