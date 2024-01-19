"use client"
import { getCurrentUser, userLogout } from "@/app/api"
import { loginSuccess, logout, selectAuthUser } from "@/store/slices/authSlice"
import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { FaUserCircle } from "@/assets/icons"

const User = () => {
	const dispatch = useDispatch()
	const user = useSelector(selectAuthUser)

	useEffect(() => {
		const fetchUser = async () => {
			try {
				if (!user) {
					const response = await getCurrentUser()
					const userData = response.data
					dispatch(loginSuccess(userData))
				}
			} catch (error) {
				await userLogout()
				dispatch(logout())
			}
		}

		fetchUser()
	}, [dispatch, user])

	console.log(user)

	return (
		<div>
			<FaUserCircle size={24} />
		</div>
	)
}
export default User
