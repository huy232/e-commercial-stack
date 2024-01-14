"use client"
import Link from "next/link"
import { path } from "@/utils"
import { userLogout } from "@/app/api"

const TopHeader = () => {
	const handleLogout = async () => {
		const response = await userLogout()
		console.log(response)
	}

	return (
		<div className="h-[40px] w-full bg-main flex items-center justify-center">
			<div className="w-main flex items-center justify-between text-xs text-white">
				<span>ORDER ONLINE OR CALL US (+1800) 000 8808</span>
				<Link
					className="hover:opacity-80 duration-200 ease-in-out"
					href={path.LOGIN}
				>
					Sign In or Create Account
				</Link>
				<button onClick={handleLogout}>Log out</button>
			</div>
		</div>
	)
}

export default TopHeader
