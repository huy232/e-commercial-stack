import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { path } from "./utils"
import { API, WEB_URL } from "./constant"

export async function authorizeMiddleware(request: NextRequest) {
	let refreshTokenCookie = request.cookies.get("refreshToken")
	let accessTokenCookie = request.cookies.get("accessToken")
	if (refreshTokenCookie || accessTokenCookie) {
		const cookieHeader = request.headers.get("cookie")
		// const checkUserResponse = await fetch(API + "/user/check-auth", {
		// 	method: "GET",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Cookie: cookieHeader || "",
		// 	},
		// 	credentials: "include",
		// })

		const checkUserResponse = await fetch(WEB_URL + "/api/user/check-auth", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieHeader || "",
			},
			credentials: "include",
		})

		const response = await checkUserResponse.json()
		if (!response.success) {
			return NextResponse.redirect(`${WEB_URL}${path.LOGIN}`)
		}
	} else {
		return NextResponse.redirect(`${WEB_URL}${path.LOGIN}`)
	}

	const response = NextResponse.next()
	return response
}

export async function loginMiddleware(request: NextRequest) {
	let refreshTokenCookie = request.cookies.get("refreshToken")
	let accessTokenCookie = request.cookies.get("accessToken")

	if (refreshTokenCookie || accessTokenCookie) {
		const cookieHeader = request.headers.get("cookie")
		// const checkUserResponse = await fetch(API + "/user/check-auth", {
		// 	method: "GET",
		// 	headers: {
		// 		"Content-Type": "application/json",
		// 		Cookie: cookieHeader || "",
		// 	},
		// 	credentials: "include",
		// })

		const checkUserResponse = await fetch(WEB_URL + "/api/user/check-auth", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieHeader || "",
			},
			credentials: "include",
		})
		const response = await checkUserResponse.json()

		if (response.success) {
			return NextResponse.redirect(`${WEB_URL}/`)
		} else {
			return NextResponse.redirect(`${WEB_URL}${path.LOGIN}`)
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
		const checkAdminResponse = await fetch(API + "/user/check-admin", {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
				Cookie: cookieHeader || "",
			},
			credentials: "include",
		})
		const adminResponse = await checkAdminResponse.json()
		if (!adminResponse.success) {
			return NextResponse.redirect(`${WEB_URL}${path.LOGIN}`)
		}
	} else {
		return NextResponse.redirect(`${WEB_URL}${path.LOGIN}`)
	}
}

export async function middleware(request: NextRequest) {
	const publicRoutes = ["/login", "/register", "/complete-registration"]
	const adminRoutes = ["/admin"]
	const profileRoutes = ["/profile"]
	if (
		publicRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
	) {
		return loginMiddleware(request)
	}
	if (adminRoutes.some((route) => request.nextUrl.pathname.startsWith(route))) {
		return adminMiddleware(request)
	}
	if (
		profileRoutes.some((route) => request.nextUrl.pathname.startsWith(route))
	) {
		return authorizeMiddleware(request)
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
		"/admin/:path*",
		"/profile",
		"/profile/:path*",
		"/cart",
		"/((?!api|_next/static|_next/image|favicon.ico).*)",
	],
}
