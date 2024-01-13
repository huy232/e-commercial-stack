import { API } from "@/constant"
import { ApiResponse } from "@/types/apiResponse"

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

export const checkUserLogin = async (): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/check-auth`, {
			method: "GET",
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
