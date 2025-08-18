"use client"
import { Users } from "@/types"
import { FC, useEffect, useState } from "react"
import { Pagination, SearchUser, UserTableRow } from "@/components"
import { useSearchParams } from "next/navigation"
import { API, URL } from "@/constant"

const ManageUserList: FC = () => {
	const [userList, setUserList] = useState<Users[]>([])
	const [totalPages, setTotalPages] = useState(1)
	const [loading, setLoading] = useState(true)
	const [userListChanged, setUserListChanged] = useState(false)
	const params = useSearchParams() // This is now treated as URLSearchParams

	useEffect(() => {
		const fetchUsers = async () => {
			setLoading(true)
			try {
				// Convert search params into an object dynamically
				const queryParams: Record<string, string> = {}
				params.forEach((value, key) => {
					queryParams[key] = value
				})

				// Ensure default pagination limit is set if not provided
				if (!queryParams.limit) {
					queryParams.limit = "2"
				}

				// Convert object to URL parameters
				const queryString = new URLSearchParams(queryParams).toString()

				const response = await fetch(
					`${API}/user/get-all-users?${queryString}`,
					{
						method: "GET",
						credentials: "include",
					}
				)
				const userResponse = await response.json()

				if (userResponse.success) {
					setUserList(userResponse.users)
					setTotalPages(userResponse.totalPages)
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

		fetchUsers()
	}, [params, userListChanged]) // Runs when search params or user list changes

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
