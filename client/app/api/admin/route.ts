import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const cookieArray = request.cookies.getAll()
		const cookieString = cookieArray
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ")
		const searchParams = request.nextUrl.searchParams
		const queryParams = new URLSearchParams(searchParams)

		const url = `${API}/user/get-all-users?${queryParams.toString()}`

		const response = await fetch(url, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieString,
			},
		})

		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error get all user:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error get all user",
			},
			{ status: 500 }
		)
	}
}

// export const updateUser = async (
// 	userId: string,
// 	requestBody: UpdateUser
// ): Promise<ApiUsersResponse<UpdateUser>> => {
// 	try {
// 		const response = await fetch(`${API}/user/user-update/${userId}`, {
// 			method: "PUT",
// 			credentials: "include",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 			body: JSON.stringify(requestBody),
// 		})

// 		const responseData: ApiUsersResponse<UpdateUser> = await response.json()
// 		return responseData
// 	} catch (error) {
// 		throw error
// 	}
// }

export async function PUT(request: NextRequest) {
	try {
		const cookieArray = request.cookies.getAll()
		const cookieString = cookieArray
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ")
		const body = await request.json()
		const { userId, ...requestBody } = body
		const response = await fetch(`${API}/user/user-update/${userId}`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieString,
			},
			body: JSON.stringify(requestBody),
		})
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error while updating user:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while updating user",
			},
			{ status: 500 }
		)
	}
}

// export const deleteUser = async (_id: string) => {
// 	try {
// 		const response = await fetch(`${API}/user/delete-user?_id=${_id}`, {
// 			method: "DELETE",
// 			credentials: "include",
// 			headers: {
// 				"Content-Type": "application/json",
// 			},
// 		})

// 		const responseData = await response.json()
// 		return responseData
// 	} catch (error) {
// 		throw error
// 	}
// }

export async function DELETE(request: NextRequest) {
	try {
		const cookieArray = request.cookies.getAll()
		const cookieString = cookieArray
			.map((cookie) => `${cookie.name}=${cookie.value}`)
			.join("; ")
		const body = await request.json()
		const { _id } = body
		const response = await fetch(`${API}/user/delete-user?_id=${_id}`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieString,
			},
		})
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error while deleting user:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while deleting user",
			},
			{ status: 500 }
		)
	}
}
