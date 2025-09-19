// app/api/auth/google-login/route.ts
import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const body = await req.json()

		const res = await fetch(`${API}/auth/google-login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				cookie: req.headers.get("cookie") || "",
			},
			credentials: "include",
			body: JSON.stringify(body),
			cache: "no-cache",
		})

		const data = await res.json()

		return NextResponse.json(data, { status: res.status })
	} catch (error: any) {
		return NextResponse.json(
			{ success: false, message: error.message || "Google login failed" },
			{ status: 500 }
		)
	}
}
