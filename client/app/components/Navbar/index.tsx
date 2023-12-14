"use client"

import { navigation } from "@/utils/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"
import { FC } from "react"

export const Navbar: FC = () => {
	const currentPath = usePathname()

	return (
		<div className="w-main h-[48px] py-2 border-y mb-6 text-sm flex items-center gap-4">
			{navigation.map((nav) => {
				const linkClasses = clsx(
					"p-2 hover:text-main duration-200 ease-in-out hover:bg-black/20 rounded",
					{
						"text-main": currentPath === nav.path,
						"text-black": currentPath !== nav.path,
					}
				)

				return (
					<Link key={nav.id} href={nav.path} className={linkClasses}>
						{nav.value}
					</Link>
				)
			})}
		</div>
	)
}
