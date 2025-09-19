import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
	try {
		const body = await request.json()
		const url = new URL(API + `/user/login`)

		const response = await fetch(url.toString(), {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				cookie: request.headers.get("cookie") || "",
			},
			body: JSON.stringify(body),
			credentials: "include",
			cache: "no-cache",
		})

		const data = await response.json()
		const nextResponse = NextResponse.json(data, { status: response.status })

		// forward Set-Cookie from Render -> Vercel
		const setCookie = response.headers.get("set-cookie")
		if (setCookie) {
			nextResponse.headers.set("set-cookie", setCookie)
		}

		return nextResponse
	} catch (err) {
		console.error("Error in Next.js login proxy:", err)
		return NextResponse.json(
			{ success: false, message: "Error while logging in" },
			{ status: 500 }
		)
	}
}
