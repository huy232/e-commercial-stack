import { path } from "@/utils"
import Link from "next/link"

const Logo = () => {
	return (
		<Link
			href={path.HOME}
			className="text-[28px] sm:text-[42px] md:text-[36px] lg:text-[24px] uppercase font-black group flex items-center mx-2 font-anton"
		>
			<div className="flex-col sm:flex-row group-hover:text-main hover-effect flex leading-none">
				<span className="block">
					<span className="inline-block">D</span>
					<span className="inline-block">igital</span>
				</span>
				<span className="block text-main group-hover:text-[#0d0d0d] hover-effect lg:pl-1">
					<span className="inline-block">W</span>
					<span className="inline-block">orld</span>
				</span>
			</div>
		</Link>
	)
}
export default Logo
