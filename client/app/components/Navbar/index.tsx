"use client"

import { navigation } from "@/utils/navigation"
import Link from "next/link"
import { usePathname } from "next/navigation"
import clsx from "clsx"

export const Navbar = () => {
	const currentPath = usePathname()

	return (
		<div className="w-main h-[48px] py-2 border-y mb-6 text-sm flex items-center">
			{navigation.map((nav) => {
				const linkClasses = clsx("pr-12 hover:text-main", {
					"text-main": currentPath === nav.path,
					"text-black": currentPath !== nav.path,
				})

				return (
					<Link key={nav.id} href={nav.path} className={linkClasses}>
						{nav.value}
					</Link>
				)
			})}
		</div>
	)
}
