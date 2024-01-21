"use client"
import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { RootState } from "@/store"
import { getCurrentUser } from "@/app/api"

interface UseAuthenticateRouteOptions {
	redirectTo?: string
}

const useAuthenticate = () => {
	const dispatch = useDispatch()
	useEffect(() => {
		const getCurrentUser = async () => {
			const response = await getCurrentUser()
		}
		getCurrentUser()
	}, [])

	return
}

export default useAuthenticate
