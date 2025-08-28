"use client"
import { FC } from "react"
import { AiOutlineLoading, MdEmail, RiPhoneFill } from "@/assets/icons"
import { Button, Logo, SidebarCart, User } from "@/components"
import { useSelector } from "react-redux"
import { selectAuthUser, selectIsAuthenticated } from "@/store/slices/authSlice"
import { useMounted } from "@/hooks"
import HeaderInform from "./HeaderInform"
import { selectNotifyState } from "@/store/slices/notifySlice"
import Notify from "./Notify"

const Header: FC = () => {
	const mounted = useMounted()
	const user = useSelector(selectAuthUser)
	const isAuthenticated = useSelector(selectIsAuthenticated)
	// const notifications = useSelector(selectNotifyState)

	if (!mounted) return null

	return (
		<div className="w-full xl:w-main h-[110px] py-[35px] flex justify-between font-inter">
			<Logo />
			<div className="flex items-center lg:text-[0.6rem] xl:text-[0.8rem]">
				<HeaderInform />
				<SidebarCart />
				{/* <Notify user={user} notifications={notifications} /> */}
				<User user={user} />
			</div>
		</div>
	)
}

export default Header
