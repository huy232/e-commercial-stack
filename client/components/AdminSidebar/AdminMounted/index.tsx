"use client"
import { selectIsAdmin, selectIsAuthenticated } from "@/store/slices/authSlice"
import { useSelector } from "react-redux"

const AdminMounted = () => {
	const isAuthenticated = useSelector(selectIsAuthenticated)
	const isAdmin = useSelector(selectIsAdmin)
	console.log(isAuthenticated)
	console.log(isAdmin)
	if (isAuthenticated && isAdmin) {
		return (
			<div className="w-[327px] flex-none">
				<div className="p-4 bg-sky-700">Admin sidebar</div>
			</div>
		)
	}
	if (!isAuthenticated && !isAdmin) {
		return <div>Redirect</div>
	}
}
export default AdminMounted
