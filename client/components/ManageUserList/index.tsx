"use client"
import { Users } from "@/types"
import { FC, useEffect, useState } from "react"
import { Pagination, SearchUser, UserTableRow } from "@/components"
import { useSearchParams } from "next/navigation"
import { URL } from "@/constant"

const ManageUserList: FC = () => {
	const [userList, setUserList] = useState<Users[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(true)
	const [userListChanged, setUserListChanged] = useState(false)
	const params = useSearchParams() as URLSearchParams

	useEffect(() => {
		const fetchUsers = async (params: any) => {
			setLoading(true)
			try {
				// const response = await getUsers(params)
				const response = await fetch(
					URL + "/api/admin?" + new URLSearchParams(params),
					{ method: "GET" }
				)
				const usersRepsonse = await response.json()
				if (usersRepsonse.success) {
					setUserList(usersRepsonse.users)
					setTotalPages(usersRepsonse.totalPages)
				} else {
					setUserList([])
					setTotalPages(1)
				}
			} catch (error) {
				setUserList([])
				setTotalPages(1)
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
					<Pagination totalPages={totalPages} />
				</>
			)}
		</div>
	)
}

export default ManageUserList
