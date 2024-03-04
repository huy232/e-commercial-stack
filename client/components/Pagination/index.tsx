"use client"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, FC, useEffect } from "react"
import ReactPaginate from "react-paginate"

interface PaginationProps {
	totalPages: number
}

const Pagination: FC<PaginationProps> = ({ totalPages }) => {
	const searchParams = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()
	const initialSelected = Number(searchParams.get("page")) ?? 1
	// const [currentPage, setCurrentPage] = useState(
	// 	Number(initialSelected) > totalPages ? totalPages : Number(initialSelected)
	// )
	const [currentPage, setCurrentPage] = useState(initialSelected)
	const [prevSearchParams, setPrevSearchParams] =
		useState<URLSearchParams | null>(null)

	useEffect(() => {
		if (prevSearchParams) {
			const pageParams = searchParams.getAll("page")
			const otherParams = Array.from(searchParams.entries()).filter(
				([key, value]) => {
					return key !== "page" && value !== prevSearchParams.get(key)
				}
			)
			if (pageParams.length > 0 && otherParams.length > 0) {
				const newSearchParams = new URLSearchParams(searchParams.toString())
				newSearchParams.set("page", "1")
				replace(`${pathname}?${newSearchParams.toString()}`)
				setCurrentPage(1)
			}
		}
		setPrevSearchParams(searchParams)
	}, [searchParams, pathname, replace, prevSearchParams, totalPages])

	const handlePageChange = ({ selected }: { selected: number }) => {
		const pageNumber = selected + 1
		const params = new URLSearchParams(searchParams)
		params.set("page", pageNumber.toString())
		replace(`${pathname}?${params.toString()}`)
		setCurrentPage(pageNumber)
	}

	return (
		<div className="flex items-center justify-center my-2">
			<ReactPaginate
				breakLabel="..."
				nextLabel="Next >"
				onPageChange={handlePageChange}
				pageRangeDisplayed={5}
				pageCount={totalPages}
				previousLabel="< Previous"
				marginPagesDisplayed={1}
				forcePage={currentPage - 1}
				containerClassName={"flex justify-center items-center gap-2"}
				activeClassName={"bg-red-500 p-1 rounded"}
				pageLinkClassName={"hover-effect hover:bg-red-500 p-1 rounded"}
				previousLinkClassName={"hover-effect hover:bg-red-500 rounded p-1"}
				nextLinkClassName={"hover-effect hover:bg-red-500 rounded p-1"}
				disabledClassName={"disabled bg-gray-500"}
			/>
		</div>
	)
}

export default Pagination
