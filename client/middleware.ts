import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkUserLogin } from "./app/api"

export async function middleware(request: NextRequest) {
	let refreshTokenCookie = request.cookies.get("refreshToken")
	let accessTokenCookie = request.cookies.get("accessToken")
	console.log(refreshTokenCookie)
	console.log(accessTokenCookie)

	if (refreshTokenCookie || accessTokenCookie) {
		const cookieHeader = request.headers.get("cookie")
		const response = await checkUserLogin(cookieHeader || undefined)
		console.log(response)

		if (response.success) {
			return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/`)
		}
	}

	const response = NextResponse.next()
	return response
}

export const config = {
	matcher: [
		"/login/:path*",
		"/register/:path*",
		"/complete-registration/:path*",
		"/login",
		"/register",
		"/complete-registration",
	],
}
