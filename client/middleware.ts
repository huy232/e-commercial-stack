import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { checkAdmin, checkUserLogin } from "./app/api"
import { path } from "./utils"

export async function authorizeMiddleware(request: NextRequest) {
	let refreshTokenCookie = request.cookies.get("refreshToken")
	let accessTokenCookie = request.cookies.get("accessToken")
	if (refreshTokenCookie || accessTokenCookie) {
		const cookieHeader = request.headers.get("cookie")
		const response = await checkUserLogin(cookieHeader || undefined)
		if (!response.success) {
			return NextResponse.redirect(
				`${process.env.NEXT_PUBLIC_CLIENT_URL}${path.LOGIN}`
			)
		}
	} else {
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_CLIENT_URL}${path.LOGIN}`
		)
	}

	const response = NextResponse.next()
	return response
}

export async function loginMiddleware(request: NextRequest) {
	let refreshTokenCookie = request.cookies.get("refreshToken")
	let accessTokenCookie = request.cookies.get("accessToken")

	if (refreshTokenCookie || accessTokenCookie) {
		const cookieHeader = request.headers.get("cookie")
		const response = await checkUserLogin(cookieHeader || undefined)

		if (response.success) {
			return NextResponse.redirect(`${process.env.NEXT_PUBLIC_CLIENT_URL}/`)
		} else {
			return NextResponse.redirect(
				`${process.env.NEXT_PUBLIC_CLIENT_URL}${path.LOGIN}`
			)
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
		if (!response.success || !adminResponse.success) {
			return NextResponse.redirect(
				`${process.env.NEXT_PUBLIC_CLIENT_URL}${path.LOGIN}`
			)
		}
	} else {
		return NextResponse.redirect(
			`${process.env.NEXT_PUBLIC_CLIENT_URL}${path.LOGIN}`
		)
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
	],
}
