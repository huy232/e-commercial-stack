import Link from "next/link"
import { path } from "@/utils"

const TopHeader = () => {
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
			</div>
		</div>
	)
}

export default TopHeader
