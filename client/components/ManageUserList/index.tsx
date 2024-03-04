"use client"
import { ApiUsersResponse, User, Users } from "@/types"
import { FC, useCallback, useEffect, useState } from "react"
import { Button, InputField, Pagination, UserTableRow } from "@/components"
import { getUsers } from "@/app/api"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { tableHeaders } from "@/constant"

interface ManageUserListProps {
	searchParams: { [key: string]: string | string[] | undefined }
	userList: Users[]
}

const ManageUserList: FC<ManageUserListProps> = ({ searchParams }) => {
	const [userList, setUserList] = useState<Users[]>([])
	const [totalPage, setTotalPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm()
	const params = useSearchParams() as URLSearchParams
	const searchParamsUser = useSearchParams()
	const pathname = usePathname()
	const { replace } = useRouter()

	useEffect(() => {
		const fetchUsers = async (params: any) => {
			setLoading(true)
			try {
				const response = await getUsers(params)
				if (response.success) {
					setUserList(response.users)
					setTotalPage(response.totalPage)
				} else {
					setUserList([])
					setTotalPage(1)
				}
			} catch (error) {
				setUserList([])
				setTotalPage(1)
				console.error("Error fetching users:", error)
			} finally {
				setLoading(false)
			}
		}

		const page = params.has("page") ? Number(params.get("page")) : 1
		const search = params.has("search") ? params.get("search") : ""
		if (search !== "") {
			fetchUsers({ page, search, limit: 1 })
		} else {
			fetchUsers({ page, limit: 1 })
		}
	}, [params])

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
		<div className="w-full p-4">
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
			<table className="table-auto mb-6 text-left w-full">
				<thead className="font-bold bg-gray-700 text-[13px] text-center text-white">
					<tr className="border border-blue-300">
						{tableHeaders.map((header, index) => (
							<th key={index} className="px-4 py-2">
								{header}
							</th>
						))}
					</tr>
				</thead>
				<tbody>
					{userList.map((user, index) => (
						<UserTableRow key={user._id} user={user} index={index} />
					))}
				</tbody>
			</table>
			<Pagination totalPages={totalPage} />
		</div>
	)
}

export default ManageUserList
