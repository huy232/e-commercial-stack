import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function PUT(
	request: NextRequest,
	{ params }: { params: { uid: string } }
) {
	try {
		const body = await request.json()

		const response = await fetch(`${API}/user/user-update/${params.uid}`, {
			method: "PUT",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			body: JSON.stringify(body),
			cache: "no-cache",
		})
		const data = await response.json()
		return new Response(JSON.stringify(data), {
			status: response.status,
			headers: {
				"Content-Type": "application/json",
			},
		})
	} catch (error) {
		console.error("Error while updating user as admin:", error)
		return NextResponse.json(
			{
				success: false,
				message: "Error while updating user as admin due to server",
			},
			{ status: 500 }
		)
	}
}
