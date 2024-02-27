import { redirect } from "next/navigation"

export default async function Admin() {
	// const user = useSelector(selectAuthUser)
	// const isAuthenticated = useSelector(selectIsAuthenticated)
	// const isAdmin = useSelector(selectIsAdmin)
	// if (user && isAuthenticated && isAdmin) {
	// 	console.log("Run here")
	// 	return <div>Admin</div>
	// } else {
	// 	redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/login`)
	// }
	return <div>Admin page</div>
}
