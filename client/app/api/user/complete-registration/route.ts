import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const token = typeof body === "string" ? body : body?.token

		if (!token) {
			return NextResponse.json(
				{ success: false, message: "Missing token" },
				{ status: 400 }
			)
		}

		const url = new URL(API + `/user/complete-registration`)
		url.searchParams.append("token", token)

		const response = await fetch(url.toString(), {
			method: "POST",
			credentials: "include",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			cache: "no-cache",
		})

		const data = await response.json()

		const nextRes = NextResponse.json(data, { status: response.status })

		const setCookie = response.headers.get("set-cookie")
		if (setCookie) {
			nextRes.headers.set("set-cookie", setCookie)
		}

		return nextRes
	} catch (error) {
		console.error("Error verify user:", error)
		return NextResponse.json(
			{ success: false, message: "Error verify user" },
			{ status: 500 }
		)
	}
}
