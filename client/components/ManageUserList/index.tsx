"use client"
import { Users } from "@/types"
import { FC, useEffect, useState } from "react"
import { Pagination, SearchUser, UserTableRow } from "@/components"
import { getUsers } from "@/app/api"
import { useSearchParams } from "next/navigation"

const ManageUserList: FC = () => {
	const [userList, setUserList] = useState<Users[]>([])
	const [totalPage, setTotalPage] = useState(1)
	const [loading, setLoading] = useState(true)
	const [userListChanged, setUserListChanged] = useState(false)
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
		const search = params.has("search") ? params.get("search") : ""
		if (search !== "") {
			fetchUsers({ page, search, limit: 1 })
		} else {
			fetchUsers({ page, limit: 1 })
		}
	}, [params, userListChanged])

	const handleUserListChange = () => {
		setUserListChanged((prevState) => !prevState)
	}

	return (
		<div className="w-full p-4">
			{!loading && (
				<>
					<SearchUser />
					<UserTableRow
						userList={userList}
						onUserListChange={handleUserListChange}
					/>
					<Pagination totalPages={totalPage} />
				</>
			)}
		</div>
	)
}

export default ManageUserList
