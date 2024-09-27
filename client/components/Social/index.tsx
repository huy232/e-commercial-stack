import {
	FaFacebook,
	BsTwitterX,
	FaPinterest,
	FaTiktok,
	FaInstagramSquare,
} from "@/assets/icons"

const Social = () => {
	return (
		<div className="flex items-center justify-center gap-8">
			<a
				href="#"
				className="flex items-center justify-center rounded-full transition-all hover:opacity-80 duration-300 hover:bg-[#1466ce] w-[42px] h-[42px] text-gray-500 hover:text-white"
			>
				<FaFacebook size={28} />
			</a>
			<a
				href="#"
				className="flex items-center justify-center rounded-full transition-all hover:opacity-80 duration-300 hover:bg-[#22262a] w-[42px] h-[42px] text-gray-500 hover:text-white"
			>
				<FaInstagramSquare size={28} />
			</a>
			<a
				href="#"
				className="flex items-center justify-center rounded-full transition-all hover:opacity-80 duration-300 hover:bg-[#E1306C] w-[42px] h-[42px] text-gray-500 hover:text-white"
			>
				<BsTwitterX size={28} />
			</a>
			<a
				href="#"
				className="flex items-center justify-center rounded-full transition-all hover:opacity-80 duration-300 hover:bg-[#00f2ea] w-[42px] h-[42px] text-gray-500 hover:text-white"
			>
				<FaTiktok size={28} />
			</a>
			<a
				href="#"
				className="flex items-center justify-center rounded-full transition-all hover:opacity-80 duration-300 hover:bg-[#ff0050] w-[42px] h-[42px] text-gray-500 hover:text-white"
			>
				<FaPinterest size={28} />
			</a>
		</div>
	)
}

export default Social
