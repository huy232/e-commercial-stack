"use client"
import { ApiUsersResponse, User, Users } from "@/types"
import { FC, useCallback, useEffect, useState } from "react"
import {
	Button,
	InputField,
	Pagination,
	SearchUser,
	UserTableRow,
} from "@/components"
import { getUsers } from "@/app/api"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useForm } from "react-hook-form"
import { tableHeaders } from "@/constant"

interface ManageUserListProps {
	searchParams: { [key: string]: string | string[] | undefined }
	userList: Users[]
}

interface EditElement {
	_id?: string
	firstName?: string
	lastName?: string
	email?: string
	avatar?: string
	mobile?: number
	role: string[]
	isBlocked?: boolean
	createdAt?: string
}

const ManageUserList: FC<ManageUserListProps> = ({ searchParams }) => {
	const [userList, setUserList] = useState<Users[]>([])
	const [totalPage, setTotalPage] = useState(1)
	const [loading, setLoading] = useState(true)
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

	return (
		<div className="w-full p-4">
			<SearchUser />
			{!loading && <UserTableRow userList={userList} />}
			<Pagination totalPages={totalPage} />
		</div>
	)
}

export default ManageUserList
