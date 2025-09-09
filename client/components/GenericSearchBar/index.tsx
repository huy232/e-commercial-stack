"use client"

import { FC, useCallback } from "react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import { CiSearch } from "@/assets/icons"
import { Button } from "@/components"

interface GenericSearchBarProps {
	searchKey?: string
	placeholder?: string
	label?: string
	className?: string
	onSearchSubmit?: (search: string) => void
	disableFormWrapper?: boolean // key prop
}

const GenericSearchBar: FC<GenericSearchBarProps> = ({
	searchKey = "search",
	placeholder = "Search...",
	label = "Search...",
	className = "",
	onSearchSubmit,
	disableFormWrapper = false,
}) => {
	const searchParams = useSearchParams()
	const { replace } = useRouter()
	const { register, handleSubmit, getValues } = useForm()

	const handleSearch = (data: any) => {
		const search = data[searchKey]
		if (onSearchSubmit) {
			onSearchSubmit(search)
		} else {
			const params = new URLSearchParams(searchParams)
			if (search) params.set(searchKey, search)
			else params.delete(searchKey)
			params.set("page", "1")
			replace(`?${params.toString()}`)
		}
	}

	const onKeyDown = (e: React.KeyboardEvent) => {
		if (e.key === "Enter") {
			e.preventDefault()
			handleSearch({ [searchKey]: getValues(searchKey) })
		}
	}

	const content = (
		<div className={`flex group h-[40px] relative ${className}`}>
			<input
				id={searchKey}
				type="search"
				placeholder={placeholder}
				className="relative border-0 text-[1rem] outline-0 pl-[30px] pr-[20px] bg-gray-300 rounded h-full w-[320px] transition-all duration-300"
				{...register(searchKey)}
				onKeyDown={disableFormWrapper ? onKeyDown : undefined}
			/>
			<label
				className="absolute p-0 border-0 h-[1px] w-[1px] overflow-hidden"
				htmlFor={searchKey}
			>
				{label}
			</label>
			<Button
				type="submit"
				className="absolute top-0 left-0 z-10 h-full pl-[4px] border-0"
				aria-label="Search"
				role="button"
				tabIndex={0}
				data-testid="search-button"
				id="search-button"
			>
				<CiSearch />
			</Button>
		</div>
	)

	if (disableFormWrapper) return content

	return <form onSubmit={handleSubmit(handleSearch)}>{content}</form>
}

export default GenericSearchBar
