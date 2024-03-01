import { path } from "@/utils"
import Link from "next/link"

const Logo = () => {
	return (
		<Link
			href={path.HOME}
			className="uppercase font-black group border-2 border-transparent hover:border-black border-solid rounded px-1"
		>
			<p className="group-hover:text-main hover-effect">
				Digital
				<span className="text-main group-hover:text-[#0d0d0d] hover-effect">
					World
				</span>
			</p>
		</Link>
	)
}
export default Logo
