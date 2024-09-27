"use client"
import { MdEmail, RiPhoneFill } from "@/assets/icons"
import { FC, useEffect, useState } from "react"
import { Logo, SidebarCart, User } from "@/components"

const Header: FC = () => {
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<div className="w-main h-[110px] py-[35px] flex justify-between">
			<Logo />
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
				{mounted && <SidebarCart />}
				{mounted && <User />}
			</div>
		</div>
	)
}

export default Header
