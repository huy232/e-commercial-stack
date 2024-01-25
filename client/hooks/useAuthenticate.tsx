"use client"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { useSelector } from "react-redux"
import { RootState } from "@/store"

interface UseAuthenticateRouteOptions {
	redirectTo?: string
}

const useAuthenticate = ({
	redirectTo = "/",
}: UseAuthenticateRouteOptions = {}) => {
	const router = useRouter()
	const isAuthenticated = useSelector(
		(state: RootState) => state.auth.isAuthenticated
	)

	useEffect(() => {
		if (isAuthenticated) {
			router.push(redirectTo)
		}
	}, [isAuthenticated, router, redirectTo])

	return isAuthenticated
}

export default useAuthenticate
