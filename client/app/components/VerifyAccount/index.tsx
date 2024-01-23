"use client"

import { verifyAccount } from "@/app/api"
import { FC, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"

const VerifyAccount: FC = () => {
	const [errorMessage, setErrorMessage] = useState("")
	const [successVerify, setSuccessVerify] = useState("")
	const searchParams = useSearchParams()

	useEffect(() => {
		const token = searchParams.get("token")
		if (token) {
			const handleVerifyAccount = async () => {
				const tokenValue = Array.isArray(token) ? token[0] : token
				try {
					const response = await verifyAccount(tokenValue)
					if (response.success && response.message) {
						setSuccessVerify(response.message)
					} else {
						setErrorMessage(
							response.message || "An error occurred during verification"
						)
					}
				} catch (error) {
					setErrorMessage(
						"An unexpected error occurred. Please try again later."
					)
				}
			}
			handleVerifyAccount()
		}
	}, [searchParams])
	return (
		<div className="w-main">
			{errorMessage && (
				<div className="flex flex-col gap-2 items-center">
					<span className="text-rose-500 italic">{errorMessage}</span>
					<span>Please try sign up again.</span>
					<Link
						className="border-2 border-rose-500 p-1 rounded hover:bg-rose-500 hover:text-white hover-effect"
						href={"/register"}
					>
						Sign up
					</Link>
				</div>
			)}
			{successVerify && (
				<div className="flex flex-col gap-2 items-center">
					<span className="text-teal-500 italic">{errorMessage}</span>
					<span>
						Your account has verified, you can proceed to shopping now.
					</span>
					<Link
						className="border-2 border-teal-500 p-1 rounded hover:bg-teal-500 hover:text-white hover-effect"
						href={"/"}
					>
						Home page
					</Link>
				</div>
			)}
		</div>
	)
}
export default VerifyAccount
