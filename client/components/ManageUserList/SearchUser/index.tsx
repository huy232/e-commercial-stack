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
				const { search } = event
				const params = new URLSearchParams(searchParamsUser)
				if (search) {
					params.set("search", search)
				} else {
					params.delete("search")
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
