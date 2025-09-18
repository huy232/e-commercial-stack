import { API } from "@/constant"
import { NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
	try {
		// safer: use req.nextUrl
		const searchParams = req.nextUrl.searchParams
		const queryString = searchParams.toString()

		const backendRes = await fetch(
			`${API}/product/get-all-product?${queryString}`,
			{
				method: "GET",
				headers: {
					cookie: req.headers.get("cookie") || "",
				},
				credentials: "include",
				cache: "no-cache",
			}
		)

		const data = await backendRes.json()
		return NextResponse.json(data, { status: backendRes.status })
	} catch (err: any) {
		return NextResponse.json(
			{ success: false, message: err.message },
			{ status: 500 }
		)
	}
}
