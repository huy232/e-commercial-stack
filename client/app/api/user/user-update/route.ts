import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(request: NextRequest) {
	try {
		const response = await fetch(API + `/user/user-update`, {
			method: "PUT",
			credentials: "include",
			body: await request.formData(),
			headers: {
				cookie: request.headers.get("cookie") || "",
			},
		})
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				cookie: request.headers.get("cookie") || "",
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
