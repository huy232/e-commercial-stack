"use client"
import { navigation } from "@/utils/"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { FC } from "react"

const Navbar: FC = () => {
	const currentPath = usePathname()
	return (
		<div className="justify-center lg:justify-start w-full lg:w-main h-[48px] py-2 border-y mb-2 flex items-center gap-4 font-semibold font-bebasNeue">
			{navigation.map((nav, index) => {
				const linkClasses = clsx(
					"p-1 my-1 text-xl lg:text-base hover:text-main duration-200 ease-in-out hover:bg-black/20 rounded",
					{
						"text-main": currentPath === nav.path,
						"text-black": currentPath !== nav.path,
					},
					nav.path === navigation[0].path && "hidden lg:block"
				)
				return (
					<Link key={index} href={nav.path} className={linkClasses}>
						{nav.value}
					</Link>
				)
			})}
		</div>
	)
}

export default Navbar
