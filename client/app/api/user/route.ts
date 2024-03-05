import {
	ApiResponse,
	ApiResponseLogin,
	ApiUsersResponse,
	UpdateUser,
	Users,
} from "@/types"
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

export interface GetUsersParams {
	limit?: number
	page?: number
	[key: string]: string | number | undefined | string[]
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

export const userLogin = async (data: UserLogin): Promise<ApiResponseLogin> => {
	try {
		const response = await fetch(`${API}/user/login`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(data),
		})

		const responseData: ApiResponseLogin = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const checkUserLogin = async (
	cookieHeader?: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/check-auth`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieHeader || "",
			},
		})

		const responseData: ApiResponse<string> = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const checkAdmin = async (
	cookieHeader?: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/check-admin`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieHeader || "",
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

export const forgotPassword = async (
	email: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/forgot-password`, {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ email }),
		})

		const responseData: ApiResponse<string> = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const resetPassword = async (
	password: string,
	token: string
): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/reset-password`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify({ password, token }),
		})

		const responseData: ApiResponse<string> = await response.json()

		return responseData
	} catch (error) {
		throw error
	}
}

export const getCurrentUser = async (): Promise<ApiResponse<string>> => {
	try {
		const response = await fetch(`${API}/user/current`, {
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

export const getUsers = async (
	params: GetUsersParams
): Promise<ApiUsersResponse<Users[]>> => {
	try {
		const queryParamsArray: Array<[string, string]> = []

		for (const [key, value] of Object.entries(params)) {
			if (value !== undefined) {
				if (Array.isArray(value)) {
					for (const item of value) {
						queryParamsArray.push([key, item.toString()])
					}
				} else {
					queryParamsArray.push([key, value.toString()])
				}
			}
		}

		const queryParams = new URLSearchParams(queryParamsArray)
		const url = `${API}/user/get-all-users?${queryParams.toString()}`

		const response = await fetch(url, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
		})

		const responseData: ApiUsersResponse<Users[]> = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}

export const updateUser = async (
	userId: string,
	requestBody: UpdateUser
): Promise<ApiUsersResponse<UpdateUser>> => {
	try {
		const response = await fetch(`${API}/user/user-update/${userId}`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(requestBody),
		})

		const responseData: ApiUsersResponse<UpdateUser> = await response.json()
		return responseData
	} catch (error) {
		throw error
	}
}
