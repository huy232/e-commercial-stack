"use client"
import { ApiUsersResponse, User, Users } from "@/types"
import { FC, useEffect, useState } from "react"
import { Pagination } from ".."
import { getUsers } from "@/app/api"
import { useSearchParams } from "next/navigation"

interface ManageUserListProps {
	searchParams: { [key: string]: string | string[] | undefined }
}

const ManageUserList: FC<ManageUserListProps> = ({ searchParams }) => {
	const [userList, setUserList] = useState<Users[]>([])
	const [totalPage, setTotalPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const params = useSearchParams() as URLSearchParams

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
		fetchUsers({ page })
	}, [params])

	return (
		<div className="w-full">
			<table className="table-auto mb-6 text-left w-full">
				<thead className="font-bold bg-gray-700 text-[13px] text-center">
					<tr>
						<th className="px-4 py-2">#</th>
						<th className="px-4 py-2">Email</th>
						<th className="px-4 py-2">Fullname</th>
						<th className="px-4 py-2">Role</th>
						<th className="px-4 py-2">Phone</th>
						<th className="px-4 py-2">Status</th>
						<th className="px-4 py-2">Created at</th>
						<th className="px-4 py-2">Actions</th>
					</tr>
				</thead>
				<tbody></tbody>
			</table>
			<Pagination totalPages={totalPage} />
		</div>
	)
}

export default ManageUserList
