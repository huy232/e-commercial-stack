import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function DELETE(request: NextRequest) {
	try {
		const { _id } = await request.json()

		const response = await fetch(API + `/user/delete-user`, {
			method: "DELETE",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			body: JSON.stringify({ user_id: _id }),
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
				message: "Error while deleting user due to server",
			},
			{ status: 500 }
		)
	}
}
