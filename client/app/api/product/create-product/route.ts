import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
	try {
		const formData = await req.formData()

		const backendRes = await fetch(`${API}/product/create-product`, {
			method: "POST",
			body: formData,
			headers: {
				cookie: req.headers.get("cookie") || "",
			},
			credentials: "include",
			cache: "no-cache",
		})

		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (err: any) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		)
	}
}
