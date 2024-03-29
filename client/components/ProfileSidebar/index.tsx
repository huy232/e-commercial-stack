"use client"

import { profileSidebarOptions } from "@/constant"
import clsx from "clsx"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Fragment, memo } from "react"

const ProfileSidebar = () => {
	const pathname = usePathname()
	const optionClass = (path: string) =>
		clsx(
			`p-1 text-left m-1 border-[1px] rounded flex items-center gap-1 hover-effect hover:bg-red-500 hover:text-white`,
			pathname === path ? "border-red-500" : "border-transparent"
		)
	return (
		<div>
			{profileSidebarOptions.map((option) => (
				<Fragment key={option.id}>
					<div className="w-full p-1">
						<Link href={option.path || ""} className={optionClass(option.path)}>
							<span>{option.icon}</span>
							<span>{option.text}</span>
						</Link>
					</div>
				</Fragment>
			))}
		</div>
	)
}
export default memo(ProfileSidebar)
