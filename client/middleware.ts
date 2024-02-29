import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkAdmin, checkUserLogin } from "./app/api"

export async function loginMiddleware(request: NextRequest) {
	let refreshTokenCookie = request.cookies.get("refreshToken")
	let accessTokenCookie = request.cookies.get("accessToken")

	if (refreshTokenCookie || accessTokenCookie) {
		const cookieHeader = request.headers.get("cookie")
		const response = await checkUserLogin(cookieHeader || undefined)

		if (response.success) {
			return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/`)
		}
	}

	const response = NextResponse.next()
	return response
}

export async function adminMiddleware(request: NextRequest) {
	let refreshTokenCookie = request.cookies.get("refreshToken")
	let accessTokenCookie = request.cookies.get("accessToken")
	if (refreshTokenCookie || accessTokenCookie) {
		const cookieHeader = request.headers.get("cookie")
		const response = await checkUserLogin(cookieHeader || undefined)
		const adminResponse = await checkAdmin(cookieHeader || undefined)
		console.log("Response middleware: ", response)
		console.log("Admin response middleware: ", adminResponse)
		if (!response.success || !adminResponse.success) {
			return NextResponse.redirect(
				`${process.env.NEXT_PUBLIC_CLIENT_URL}/login`
			)
		}
	}
}

export async function middleware(request: NextRequest) {
	if (
		request.nextUrl.pathname.startsWith("/login") ||
		request.nextUrl.pathname.startsWith("/register") ||
		request.nextUrl.pathname.startsWith("/complete-registration")
	) {
		return loginMiddleware(request)
	}
	if (request.nextUrl.pathname.startsWith("/admin")) {
		return adminMiddleware(request)
	}

	return NextResponse.next()
}

export const config = {
	matcher: [
		"/login/:path*",
		"/register/:path*",
		"/complete-registration/:path*",
		"/login",
		"/register",
		"/complete-registration",
		"/admin",
		"/admin:path*",
	],
}
