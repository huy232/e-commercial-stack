"use client"
import { FaChevronLeft, FaChevronRight } from "@/assets/icons"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, FC, useEffect, useCallback } from "react"
import ReactPaginate from "react-paginate"

interface PaginationProps {
	totalPages: number
	showPageInput?: boolean // Optional feature
}

const Pagination: FC<PaginationProps> = ({
	totalPages,
	showPageInput = false,
}) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	const initialSelected = searchParams.has("page")
		? Number(searchParams.get("page"))
		: 1

	const [currentPage, setCurrentPage] = useState(
		Number(initialSelected) > totalPages ? totalPages : Number(initialSelected)
	)

	const [pageInput, setPageInput] = useState(currentPage.toString())

	const updateURLPage = useCallback(
		(page: number) => {
			const params = new URLSearchParams(searchParams)
			params.set("page", page.toString())
			replace(`${pathname}?${params.toString()}`)
		},
		[searchParams, pathname, replace]
	)

	const handlePageChange = ({ selected }: { selected: number }) => {
		const pageNumber = selected + 1
		setCurrentPage(pageNumber)
		setPageInput(pageNumber.toString())
		updateURLPage(pageNumber)
	}

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setPageInput(e.target.value)
	}

	const handleInputSubmit = (e: React.FormEvent) => {
		e.preventDefault()
		const num = Number(pageInput)
		if (!isNaN(num)) {
			const clamped = Math.max(1, Math.min(totalPages, num))
			setCurrentPage(clamped)
			setPageInput(clamped.toString())
			updateURLPage(clamped)
		}
	}

	useEffect(() => {
		if (currentPage > totalPages) {
			setCurrentPage(totalPages)
			updateURLPage(totalPages)
		} else if (currentPage < 1) {
			setCurrentPage(1)
			updateURLPage(1)
		}
	}, [currentPage, totalPages, updateURLPage])

	return (
		<div className="flex flex-col items-center gap-2 my-4">
			<ReactPaginate
				breakLabel="..."
				nextLabel={
					<>
						<span>Next</span> <FaChevronRight className="mt-[2px]" />
					</>
				}
				onPageChange={handlePageChange}
				pageRangeDisplayed={3}
				pageCount={totalPages}
				previousLabel={
					<>
						<FaChevronLeft className="mt-[2px]" />
						<span>Previous</span>
					</>
				}
				marginPagesDisplayed={1}
				forcePage={currentPage - 1}
				containerClassName="flex items-center gap-3 text-sm"
				pageLinkClassName="px-3 py-1 rounded-md border hover:bg-red-500 hover:text-white transition-all"
				activeClassName="bg-red-500 text-white py-1 rounded-md"
				previousLinkClassName={`gap-1 px-2 py-1 flex items-center rounded-lg border transition-all ${
					currentPage === 1
						? "cursor-not-allowed opacity-50"
						: "hover:bg-red-500 hover:text-white"
				}`}
				nextLinkClassName={`gap-1 px-2 py-1 flex items-center rounded-lg border transition-all ${
					currentPage === totalPages
						? "cursor-not-allowed opacity-50"
						: "hover:bg-red-500 hover:text-white"
				}`}
				renderOnZeroPageCount={null}
			/>

			{showPageInput && (
				<form
					onSubmit={handleInputSubmit}
					className="text-sm mt-2 flex items-center gap-2"
				>
					<span>Page</span>
					<input
						type="number"
						value={pageInput}
						onChange={handleInputChange}
						className="w-16 px-2 py-1 border rounded-md text-center"
						min={1}
						max={totalPages}
					/>
					<span>of {totalPages}</span>
					<button
						type="submit"
						className="ml-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
					>
						Go
					</button>
				</form>
			)}
		</div>
	)
}

export default Pagination
