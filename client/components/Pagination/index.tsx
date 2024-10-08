// "use client"
// import { usePathname, useRouter, useSearchParams } from "next/navigation"
// import { useState, FC, useEffect } from "react"
// import ReactPaginate from "react-paginate"

// interface PaginationProps {
// 	totalPages: number
// }

// const Pagination: FC<PaginationProps> = ({ totalPages }) => {
// 	const searchParams = useSearchParams()
// 	const pathname = usePathname()
// 	const { replace } = useRouter()
// 	const initialSelected = searchParams.has("page")
// 		? Number(searchParams.get("page"))
// 		: 1
// 	const [currentPage, setCurrentPage] = useState(
// 		Number(initialSelected) > totalPages ? totalPages : Number(initialSelected)
// 	)
// 	// const [currentPage, setCurrentPage] = useState(initialSelected)
// 	const [prevSearchParams, setPrevSearchParams] =
// 		useState<URLSearchParams | null>(null)

// 	useEffect(() => {
// 		if (prevSearchParams) {
// 			const pageParams = searchParams.getAll("page")
// 			const otherParams = Array.from(searchParams.entries()).filter(
// 				([key, value]) => {
// 					return key !== "page" && value !== prevSearchParams.get(key)
// 				}
// 			)
// 			if (pageParams.length > 0 && otherParams.length > 0) {
// 				const newSearchParams = new URLSearchParams(searchParams.toString())
// 				newSearchParams.set("page", "1")
// 				replace(`${pathname}?${newSearchParams.toString()}`)
// 				setCurrentPage(1)
// 			}
// 		}
// 		setPrevSearchParams(searchParams)
// 	}, [
// 		searchParams,
// 		pathname,
// 		replace,
// 		prevSearchParams,
// 		totalPages,
// 		currentPage,
// 	])

// 	const handlePageChange = ({ selected }: { selected: number }) => {
// 		const pageNumber = selected + 1
// 		const params = new URLSearchParams(searchParams)
// 		params.set("page", pageNumber.toString())
// 		replace(`${pathname}?${params.toString()}`)
// 		setCurrentPage(pageNumber)
// 	}
// 	console.log(totalPages)
// 	return (
// 		<div className="flex items-center justify-center my-2">
// 			<ReactPaginate
// 				breakLabel="..."
// 				nextLabel="Next >"
// 				onPageChange={handlePageChange}
// 				pageRangeDisplayed={5}
// 				pageCount={totalPages}
// 				previousLabel="< Previous"
// 				marginPagesDisplayed={1}
// 				forcePage={currentPage - 1}
// 				containerClassName={"flex justify-center items-center gap-2"}
// 				activeClassName={"bg-red-500 p-1 rounded"}
// 				pageLinkClassName={"hover-effect hover:bg-red-500 p-1 rounded"}
// 				previousLinkClassName={"hover-effect hover:bg-red-500 rounded p-1"}
// 				nextLinkClassName={"hover-effect hover:bg-red-500 rounded p-1"}
// 				disabledClassName={"disabled bg-gray-500 cursor-not-allowed"}
// 				disableInitialCallback={true}
// 				renderOnZeroPageCount={null}
// 			/>
// 		</div>
// 	)
// }

// export default

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

	// Get the initial page number from the URL, default to 1 if not set
	const initialSelected = searchParams.has("page")
		? Number(searchParams.get("page"))
		: 1

	// Set current page based on the URL param, but cap it at the totalPages value
	const [currentPage, setCurrentPage] = useState(
		Number(initialSelected) > totalPages ? totalPages : Number(initialSelected)
	)

	// Check if user enters an invalid page and redirect if necessary
	useEffect(() => {
		// If the current page exceeds totalPages, or is less than 1, adjust it
		if (currentPage > totalPages) {
			setCurrentPage(totalPages)
			const params = new URLSearchParams(searchParams)
			params.set("page", totalPages.toString())
			replace(`${pathname}?${params.toString()}`)
		} else if (currentPage < 1) {
			setCurrentPage(1)
			const params = new URLSearchParams(searchParams)
			params.set("page", "1")
			replace(`${pathname}?${params.toString()}`)
		}
	}, [currentPage, totalPages, pathname, replace, searchParams])

	// Handle page change events (when user interacts with the pagination component)
	const handlePageChange = ({ selected }: { selected: number }) => {
		const pageNumber = selected + 1 // ReactPaginate uses 0-based index
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
				disabledClassName={"disabled bg-gray-500 cursor-not-allowed"}
				disableInitialCallback={true}
				renderOnZeroPageCount={null}
			/>
		</div>
	)
}

export default Pagination
