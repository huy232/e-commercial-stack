import { useEffect } from "react"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface UseProtectedRouteOptions {
	redirectTo?: string
}

const useProtectedRoute = ({
	redirectTo = "/login",
}: UseProtectedRouteOptions = {}) => {
	const router = useRouter()
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	)

	useEffect(() => {
		if (!isAuthenticated) {
			router.push(redirectTo)
		}
	}, [isAuthenticated, router, redirectTo])

	return isAuthenticated
}

export default useProtectedRoute
