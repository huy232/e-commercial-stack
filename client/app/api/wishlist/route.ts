import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
	try {
		const response = await fetch(API + `/wishlist/`, {
			method: "GET",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-cache",
		})
		if (!response.ok) {
			throw new Error(`Error: ${response.status}`)
		}
		const responseData = await response.json()
		return NextResponse.json(responseData, { status: response.status })
	} catch (error) {
		throw error
	}
}
