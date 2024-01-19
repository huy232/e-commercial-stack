import { NextResponse } from "next/server"
import { userLogin } from "@/app/api"
import { passwordHashingClient } from "@/utils"

export async function POST(req: Request) {
	const body = await req.json()
	const { email, password } = body

	try {
		const hashPassword = await passwordHashingClient(password)
		const response = await userLogin({ email, password: hashPassword })

		if (!response.success) {
			return NextResponse.json({ error: response.message }, { status: 404 })
		}
		return NextResponse.json({ response }, { status: 200 })
	} catch (error) {
		return NextResponse.json(
			{ error: "Internal Server Error" },
			{ status: 500 }
		)
	}
}
