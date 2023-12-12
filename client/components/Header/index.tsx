import {
	BsHandbagFill,
	FaUserCircle,
	MdEmail,
	RiPhoneFill,
} from "@/assets/icons"
import { path } from "@/utils/path"
import Link from "next/link"

export const Header = () => {
	return (
		<div className="border w-main h-[110px] py-[35px] flex justify-between">
			<Link
				href={path.HOME}
				className="uppercase font-black group border-2 border-transparent hover:border-black border-solid rounded"
			>
				<p className=" group-hover:text-main transition-all duration-300 ease-in-out">
					Digital
					<span className="text-main group-hover:text-[#0d0d0d] transition-all duration-300 ease-in-out">
						World
					</span>
				</p>
			</Link>

			<div className="flex text-[14px]">
				<div className="flex flex-col items-center px-6 border-r">
					<span className="flex gap-4 items-center">
						<RiPhoneFill color="red" />
						<span className="font-semibold">(+1800) 000 8808</span>
					</span>
					<span>Mon-Sat 9:00AM - 8:00PM</span>
				</div>
				<div className="flex flex-col items-center px-6 border-r">
					<span className="flex gap-4 items-center">
						<MdEmail color="red" />
						<span className="font-semibold">SUPPORT@DIGITALWORLD.COM</span>
					</span>
					<span>Support 24/7</span>
				</div>
				<div className="flex items-center justify-center gap-2 px-6 border-r">
					<BsHandbagFill color="red" />
					<span>0 item(s)</span>
				</div>
				<div className="flex items-center justify-center gap-2 px-6">
					<FaUserCircle size={24} />
				</div>
			</div>
		</div>
	)
}
