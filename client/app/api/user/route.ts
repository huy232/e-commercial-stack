import { ApiResponse } from "@/types"
import { API } from "@/constant"

// User Route
export interface UserRegister {
	firstName: string
	lastName: string
	email: string
	password: string
}

export interface UserLogin {
	email: string
	password: string
}

export const userRegister = async (
	data: UserRegister
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/register`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		const responseData: ApiResponse<string> = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const userLogin = async (
	data: UserLogin
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/login`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		const responseData: ApiResponse<string> = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const checkUserLogin = async (
	cookies: string | undefined
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/check-auth`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookies || "",
			},
		})

		const responseData: ApiResponse<string> = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const userLogout = async (): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/logout`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})

		const responseData: ApiResponse<string> = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const verifyAccount = async (
	token: string
): Promise<ApiResponse<string>> => {
	try {
		const url = new URL(`${API}/user/complete-registration`)
		url.searchParams.append("token", token)

		const response = await fetch(url.toString(), {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})
		const responseData: ApiResponse<string> = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}
