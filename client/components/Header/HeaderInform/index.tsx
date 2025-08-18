import { MdEmail, RiPhoneFill } from "@/assets/icons"

const HeaderInform = () => {
	return (
		<>
			<div className="hidden lg:flex flex-col items-center pr-2">
				<span className="flex gap-2 items-center">
					<RiPhoneFill color="red" />
					<span className="font-semibold text-[0.6rem]">(+1800) 000 8808</span>
				</span>
				<span className="text-[0.6rem]">Mon-Sat 9:00AM - 8:00PM</span>
			</div>
			<div className="hidden lg:flex flex-col items-center px-2">
				<span className="flex gap-2 items-center">
					<MdEmail color="red" />
					<span className="font-semibold text-[0.6rem]">
						SUPPORT@DIGITALWORLD.COM
					</span>
				</span>
				<span className="text-[0.6rem]">Support 24/7</span>
			</div>
		</>
	)
}
export default HeaderInform
